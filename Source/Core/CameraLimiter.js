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
     * @param {AxisAlignedBoundingObject|BoundingRectangle|BoundingSphere|OrientedBoundingBox} [options.boundingObject = undefined] Assigned to the boundingObject attribute which can be used to specify limits on locations.
     * @param {HeadingPitchRoll} [options.minimumHeadingPitchRoll=undefined] Assigned to the minHeadingPitchRoll attribute which can be used to limit the minimum orientation.
     * @param {HeadingPitchRoll} [options.maximumHeadingPitchRoll=undefined] Assigned to the maxHeadingPitchRoll attribute which can be used to limit the maximum orientation.
     */
    function CameraLimiter(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this.boundingObject = options.boundingObject;

        this.minHeadingPitchRoll = options.minimumHeadingPitchRoll;
        this.maxHeadingPitchRoll = options.maximumHeadingPitchRoll;
    }

    /**
     * If inputted position is valid in bounding object, returns position. Otherwise returns closest valid location on the bounding object to the position.
     *
     * @param {Cartesian3|Cartographic} position The position we are using to check for a valid location in the bounding object.
     * @return {Cartesian3|Cartographic} A valid location.
     */
    CameraLimiter.prototype.closestLocationTo = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('positionToCheck', position);
        if (!(position instanceof Cartesian3) && !(position instanceof Cartographic)) {
            throw new DeveloperError('positionToCheck required to be of type Cartesian3 or Cartographic.');
        }
        //>>includeEnd('debug');

        if (!defined(this.boundingObject)) {
            return position;
        }

        var cartesianPosition = (position instanceof Cartographic) ? Cartographic.toCartesian(position) : position;

        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            cartesianPosition = this._closestLocationInAxisAligned(cartesianPosition);
        } else if (this.boundingObject instanceof BoundingRectangle) {
            cartesianPosition = this._closestLocationInBoundingRectangle(cartesianPosition);
        } else if (this.boundingObject instanceof BoundingSphere) {
            cartesianPosition = this._closestLocationInBoundingSphere(cartesianPosition);
        } else if (this.boundingObject instanceof OrientedBoundingBox) {
            cartesianPosition = this._closestLocationInOrientedBoundingBox(cartesianPosition);
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('Bounding Object not of allowed type. '
                                     + 'Must be AxisAlignedBoundingBox|BoundingRectangle|BoundingSphere|OrientedBoundingBox');
            //>>includeEnd('debug');
        }

        return (position instanceof Cartographic) ? Cartographic.fromCartesian(cartesianPosition) : cartesianPosition;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInAxisAligned = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('this.boundingObject.minimum', this.boundingObject.minimum);
        Check.defined('this.boundingObject.maximum', this.boundingObject.maximum);
        Check.defined('this.boundingObject.center', this.boundingObject.center);
        //>>includeEnd('debug');

        var axisAlignedMinimum = this.boundingObject.minimum;
        var axisAlignedMaximum = this.boundingObject.maximum;
        var returningPosition = position;

        returningPosition.x = Math.max(axisAlignedMinimum.x, Math.min(axisAlignedMaximum.x, returningPosition.x));
        returningPosition.y = Math.max(axisAlignedMinimum.y, Math.min(axisAlignedMaximum.y, returningPosition.y));
        returningPosition.z = Math.max(axisAlignedMinimum.z, Math.min(axisAlignedMaximum.z, returningPosition.z));

        return returningPosition;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInBoundingRectangle = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('this.boundingObject.x', this.boundingObject.x);
        Check.defined('this.boundingObject.y', this.boundingObject.y);
        Check.defined('this.boundingObject.width', this.boundingObject.width);
        Check.defined('this.boundingObject.height', this.boundingObject.height);
        //>>includeEnd('debug');

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
        //>>includeStart('debug', pragmas.debug);
        Check.defined('this.boundingObject.radius', this.boundingObject.radius);
        Check.defined('this.boundingObject.center', this.boundingObject.center);
        //>>includeEnd('debug');

        var center = this.boundingObject.center;
        var radius = this.boundingObject.radius;

        // to avoid dividing by zero check if same location as center.
        if (position.equals(center)) {
            return position;
        }

        var distanceToCenter = Cartesian3.distance(position, center);
        var locationOnSphereInDirection = radius * (position - center) / distanceToCenter + center;

        var distanceToLocOnSphere = Cartesian3.distance(locationOnSphereInDirection, center);
        var distanceToPosition = Cartesian3.distance(position, center);

        return (distanceToPosition < distanceToLocOnSphere) ? position : locationOnSphereInDirection;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationInOrientedBoundingBox = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('this.boundingObject.center', this.boundingObject.center);
        Check.defined('this.boundingObject.halfAxes', this.boundingObject.halfAxes);
        //>>includeEnd('debug');

        // to avoid inverse of a zero matrix (since that doesn't exist).
        if (this.boundingObject.halfAxes.equals(Matrix3.ZERO)) {
            return (position.equals(Cartesian3.ZERO));
        }

        // convert world space positionToCheck to orientedBoundingBox's object space.
        var twiceScale = Matrix3.IDENTITY * 2.0;
        var actualScaleTransform = this.boundingObject.halfAxes * twiceScale;
        var inverseTransformationMatrix = Matrix3.inverse(actualScaleTransform, Matrix3.IDENTITY);
        var positionInObjectSpace = inverseTransformationMatrix * position;

        // once in object space just check if converted location is within axis oriented unit cube (bc we did actual scale instead of half axes)
        var minimum = new Cartesian3(-0.5, -0.5, -0.5);
        var maximum = new Cartesian3(0.5, 0.5, 0.5);

        var returningPosition = positionInObjectSpace;

        returningPosition.x = Math.max(minimum.x, Math.min(maximum.x, returningPosition.x));
        returningPosition.y = Math.max(minimum.y, Math.min(maximum.y, returningPosition.y));
        returningPosition.z = Math.max(minimum.z, Math.min(maximum.z, returningPosition.z));

        return (Matrix3.inverse(inverseTransformationMatrix, Matrix3.IDENTITY) * returningPosition);
    };

    /**
     * If inputted orientation is valid within the min and max {@link HeadingPitchRoll} limits defined for this limiter, returns orientation.
     * Otherwise returns closest valid orientation within the min and max {@link HeadingPitchRoll} limits defined for this limiter.
     *
     * @param {Cartesian3|Cartographic} orientation The orientation we are checking to be between the limiter's min and max {@link HeadingPitchRoll} attributes.
     * @return {Cartesian3|Cartographic} A valid orientation.
     */
    CameraLimiter.prototype.closestOrientationTo = function(orientation) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('orientation', orientation);
        if (!(orientation instanceof HeadingPitchRoll)) {
            throw new DeveloperError('orientation required to be of type HeadingPitchRoll.');
        }

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

        returningOrientation.heading = Math.max(this.minHeadingPitchRoll.heading, Math.min(this.maxHeadingPitchRoll.heading, returningOrientation.heading));
        returningOrientation.pitch = Math.max(this.minHeadingPitchRoll.pitch, Math.min(this.maxHeadingPitchRoll.pitch, returningOrientation.pitch));
        returningOrientation.roll = Math.max(this.minHeadingPitchRoll.roll, Math.min(this.maxHeadingPitchRoll.roll, returningOrientation.roll));

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
            var options = {};
            result = new CameraLimiter(options);
        }

        if (!defined(limiter.boundingObject)) {
            result.boundingObject = undefined;
        } else if (limiter.boundingObject instanceof AxisAlignedBoundingBox) {
            result.boundingObject = AxisAlignedBoundingBox.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof BoundingRectangle) {
            result.boundingObject = BoundingRectangle.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof BoundingSphere) {
            result.boundingObject = BoundingSphere.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof OrientedBoundingBox) {
            result.boundingObject = OrientedBoundingBox.clone(limiter.boundingObject, result.boundingObject);
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('bounding object is not of an allowed type');
            //>>includeEnd('debug');
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
            result.minHeadingPitchRoll = HeadingPitchRoll.clone(limiter.minHeadingPitchRoll);
            result.maxHeadingPitchRoll = HeadingPitchRoll.clone(limiter.maxHeadingPitchRoll);
        }

        return result;
    };

    return CameraLimiter;
});
