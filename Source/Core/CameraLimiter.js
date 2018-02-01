define([
    '../Core/AxisAlignedBoundingBox',
    '../Core/BoundingRectangle',
    '../Core/BoundingSphere',
    '../Core/Cartesian2',
    '../Core/Cartesian3',
    '../Core/Cartesian4',
    '../Core/Cartographic',
    '../Core/Check',
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/defineProperties',
    '../Core/DeveloperError',
    '../Core/EasingFunction',
    '../Core/Ellipsoid',
    '../Core/EllipsoidGeodesic',
    '../Core/Event',
    '../Core/HeadingPitchRange',
    '../Core/HeadingPitchRoll',
    '../Core/Intersect',
    '../Core/IntersectionTests',
    '../Core/Math',
    '../Core/Matrix3',
    '../Core/Matrix4',
    '../Core/OrientedBoundingBox'
], function(
    AxisAlignedBoundingBox,
    BoundingRectangle,
    BoundingSphere,
    Cartesian2,
    Cartesian3,
    Cartesian4,
    Cartographic,
    Check,
    defaultValue,
    defined,
    defineProperties,
    DeveloperError,
    EasingFunction,
    Ellipsoid,
    EllipsoidGeodesic,
    Event,
    HeadingPitchRange,
    HeadingPitchRoll,
    Intersect,
    IntersectionTests,
    CesiumMath,
    Matrix3,
    Matrix4,
    OrientedBoundingBox) {
    'use strict';

    /**
     * The CameraLimiter is used to limit a {@Camera}'s position (using a bounding object) and orientation (defined by {@HeadingPitchRange}.
     *
     * @alias CameraLimiter
     * @constructor
     *
     * @param {AxisAlignedBoundingBox|BoundingRectangle|BoundingSphere|OrientedBoundingBox} [options.boundingObject] Assigned to the boundingObject attribute which can be used to specify limits on locations.
     * @param {HeadingPitchRoll} [options.minimumHeadingPitchRoll] Assigned to the minHeadingPitchRoll attribute which can be used to limit the minimum orientation.
     * @param {HeadingPitchRoll} [options.maximumHeadingPitchRoll] Assigned to the maxHeadingPitchRoll attribute which can be used to limit the maximum orientation.
     */
    function CameraLimiter(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        /**
         * The BoundingObject.
         * @type {AxisAlignedBoundingBox|BoundingRectangle|BoundingSphere|OrientedBoundingBox}
         * @default undefined
         */
        this.boundingObject = options.boundingObject;

        /**
         * The minimum orientation values.
         * @type {HeadingPitchRoll}
         * @default undefined
         */
        this.minHeadingPitchRoll = HeadingPitchRoll.clone(options.minimumHeadingPitchRoll);

        /**
         * The maximum orientation values.
         * @type {HeadingPitchRoll}
         * @default undefined
         */
        this.maxHeadingPitchRoll = HeadingPitchRoll.clone(options.maximumHeadingPitchRoll);
    }

    /**
     * @private
     */
    CameraLimiter.prototype.closestLocationTo = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object(position, 'Cartesian3');
        //>>includeEnd('debug');

        if (!defined(this.boundingObject)) {
            return position;
        }

        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            return this._closestLocationInAxisAligned(position);
        } else if (this.boundingObject instanceof BoundingRectangle) {
            return this._closestLocationInBoundingRectangle(position);
        } else if (this.boundingObject instanceof BoundingSphere) {
            return this._closestLocationInBoundingSphere(position);
        } else if (this.boundingObject instanceof OrientedBoundingBox) {
            return this._closestLocationInOrientedBoundingBox(position);
        }
        //>>includeStart('debug', pragmas.debug);
        throw new DeveloperError('Bounding Object not of allowed type. '
                                 + 'Must be AxisAlignedBoundingBox|BoundingRectangle|BoundingSphere|OrientedBoundingBox');
        //>>includeEnd('debug');
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInAxisAligned = function(position) {
        var axisAlignedMinimum = this.boundingObject.minimum;
        var axisAlignedMaximum = this.boundingObject.maximum;

        position.x = Math.max(axisAlignedMinimum.x, Math.min(axisAlignedMaximum.x, position.x));
        position.y = Math.max(axisAlignedMinimum.y, Math.min(axisAlignedMaximum.y, position.y));
        position.z = Math.max(axisAlignedMinimum.z, Math.min(axisAlignedMaximum.z, position.z));

        return position;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInBoundingRectangle = function(position) {
        var rect = this.boundingObject;

        var rectMinimum = new Cartesian2(rect.x, rect.y);
        var rectMaximum = new Cartesian2(rect.x + rect.width, rect.y + rect.height);
        var returningPosition = new Cartesian2(position.x, position.y);

        returningPosition.x = Math.max(rectMinimum.x, Math.min(rectMaximum.x, returningPosition.x));
        returningPosition.y = Math.max(rectMinimum.y, Math.min(rectMaximum.y, returningPosition.y));

        return new Cartesian3(returningPosition.x, returningPosition.y, position.z);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInBoundingSphere = function(position) {
        var center = this.boundingObject.center;
        var radius = this.boundingObject.radius;

        // to avoid dividing by zero check if same location as center
        if (position.equals(center)) {
            return position;
        }
        // check if already within sphere
        if (Cartesian3.distance(position, center) < radius) {
            return position;
        }

        var offset = 0.0005;
        var direction = new Cartesian3();
        Cartesian3.subtract(position, center, direction);
        Cartesian3.normalize(direction, direction);
        Cartesian3.multiplyByScalar(direction, radius - offset, direction);
        return Cartesian3.add(direction, center, new Cartesian3());
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInOrientedBoundingBox = function(position) {
        // to avoid inverse of a zero matrix (since that doesn't exist).
        if (this.boundingObject.halfAxes.equals(Matrix3.ZERO)) {
            return (position.equals(Cartesian3.ZERO));
        }

        // convert world space positionToCheck to orientedBoundingBox's object space.
        var twiceScale = Matrix3.fromUniformScale(2.0);
        var actualScaleTransform = Matrix3.multiply(this.boundingObject.halfAxes, twiceScale, new Matrix3.fromScale(1.0));
        var inverseTransformationMatrix = Matrix3.inverse(actualScaleTransform, new Matrix3.fromScale(1.0));
        var positionInObjectSpace = Matrix3.multiplyByVector(inverseTransformationMatrix, position, new Matrix3.fromScale(1.0));

        // once in object space just check if converted location is within axis oriented unit cube (bc we did actual scale instead of half axes)
        var minimum = new Cartesian3(-0.5, -0.5, -0.5);
        var maximum = new Cartesian3(0.5, 0.5, 0.5);

        var returningPosition = positionInObjectSpace;

        returningPosition.x = CesiumMath.clamp(returningPosition.x, minimum.x, maximum.x);
        returningPosition.y = CesiumMath.clamp(returningPosition.y, minimum.y, maximum.y);
        returningPosition.z = CesiumMath.clamp(returningPosition.z, minimum.z, maximum.z);

        return Matrix3.multiplyByVector(Matrix3.inverse(inverseTransformationMatrix, new Matrix3.fromScale(1.0)), returningPosition, returningPosition);


        /// - Cesium.Matrix3.getScale... Math.clamp
    };

    /**
     * @private
     */
    CameraLimiter.prototype.closestOrientationTo = function(orientation) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object(orientation, 'HeadingPitchRoll');

        // if min is defined, max must also be. if min is not defined, max must also not be.
        if (!defined(this.minHeadingPitchRoll) && defined(this.maxHeadingPitchRoll)) {
            throw new DeveloperError('minHeadingPitchRoll is required.');
        }
        if (defined(this.minHeadingPitchRoll) && !defined(this.maxHeadingPitchRoll)) {
            throw new DeveloperError('maxHeadingPitchRoll is required.');
        }
        //>>includeEnd('debug');

        if(!defined(this.minHeadingPitchRoll)) {
            return orientation;
        }

        var returningOrientation = orientation;

        returningOrientation.heading = CesiumMath.clamp(returningOrientation.heading, this.minHeadingPitchRoll.heading, this.maxHeadingPitchRoll.heading);
        returningOrientation.pitch = CesiumMath.clamp(returningOrientation.pitch, this.minHeadingPitchRoll.pitch, this.maxHeadingPitchRoll.pitch);
        returningOrientation.roll = CesiumMath.clamp(returningOrientation.roll, this.minHeadingPitchRoll.roll, this.maxHeadingPitchRoll.roll);

        return returningOrientation;
    };

    /**
     * Duplicates this CameraLimiter instance.
     *
     * @param {CameraLimiter} [result] The object onto which to store the result.
     * @returns {CameraLimiter} The modified result parameter or a new CameraLimiter instance if one was not provided.
     */
    CameraLimiter.clone = function(limiter, result) {
        if (!defined(result)) {
            result = new CameraLimiter();
        }

        if (defined(limiter.boundingObject)) {
            limiter.boundingObject.clone(result.boundingObject);
        }

        // if min is defined, max must also be. if min is not defined, max must also not be.
        if (!defined(this.minHeadingPitchRoll) && defined(this.maxHeadingPitchRoll)) {
            throw new DeveloperError('minHeadingPitchRoll is required.');
        }
        if (defined(this.minHeadingPitchRoll) && !defined(this.maxHeadingPitchRoll)) {
            throw new DeveloperError('maxHeadingPitchRoll is required.');
        }

        if (defined(limiter.minHeadingPitchRoll)) {
            // because of allLimiterValuesCreatedProperly - if min exists, max must too
            limiter.minHeadingPitchRoll.clone(result.minHeadingPitchRoll);
            limiter.maxHeadingPitchRoll.clone(result.maxHeadingPitchRoll);
        }

        return result;
    };

    return CameraLimiter;
});
