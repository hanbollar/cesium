define([
        '../Core/AxisAlignedBoundingBox',
        '../Core/BoundingRectangle',
        '../Core/BoundingSphere',
        '../Core/Cartesian2',
        '../Core/Cartesian3',
        '../Core/Cartesian4',
        '../Core/Cartographic',
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
        '../Core/OrientedBoundingBox',
        '../Core/OrthographicFrustum',
        '../Core/OrthographicOffCenterFrustum',
        '../Core/PerspectiveFrustum',
        '../Core/Quaternion',
        '../Core/Ray',
        '../Core/Rectangle',
        '../Core/Transforms',
        './CameraFlightPath',
        './MapMode2D',
        './SceneMode'
    ], function(
        AxisAlignedBoundingBox,
        BoundingRectangle,
        BoundingSphere,
        Cartesian2,
        Cartesian3,
        Cartesian4,
        Cartographic,
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
        OrientedBoundingBox,
        OrthographicFrustum,
        OrthographicOffCenterFrustum,
        PerspectiveFrustum,
        Quaternion,
        Ray,
        Rectangle,
        Transforms,
        CameraFlightPath,
        MapMode2D,
        SceneMode) {
    'use strict';

    /**
     * The camera limiter is defined by specific bounding objects and/or additional limit parameters for any position
     * and orientation adjustments.
     * <br /><br />
     *
     * @alias CameraLimiter
     *
     * @constructor
     */
    function CameraLimiter() {

        this.boundingObject = {
            axisAligned : undefined,
            boundingRectangle : undefined,
            boundingSphere : undefined,
            orientedBoundingBox : undefined
        };
        this.coordinateLimits = {
            minLatitude : undefined,
            maxLatitude : undefined,
            minLongitude : undefined,
            maxLongitude : undefined
        };
        this.headingPitchRollLimits = {
            minHeadingPitchRoll : undefined,
            maxHeadingPitchRoll : undefined,
            minHeading : undefined,
            maxHeading : undefined,
            minPitch : undefined,
            maxPitch : undefined,
            minRoll : undefined,
            maxRoll : undefined
        };

    };

    /**
     * @private
     */
    CameraLimiter.prototype._positionAndElementsDefined = function(position) {
        if (!defined(position)) {
            throw new DeveloperError('positionToCheck is required.');
        }
        if (!defined(position.x)) {
            throw new DeveloperError('x is required.');
        }
        if (!defined(position.y)) {
            throw new DeveloperError('y is required.');
        }
        if (!defined(position.z)) {
            throw new DeveloperError('z is required.');
        }
        return true;
    }

    /**
     * Checks if the inputted Cartesian3 is within every bounding object used for this limiter.
     * These bounding objects can be any of the following {@link AxisAlignedBoundingBox}, {@link BoundingRectangle},
     * {@link BoundingSphere}, and {@link OrientedBoundingBox}.
     *
     * <code>true</code> if the inputted Cartesian3 is within all of the following components if they are defined:
     * {@link AxisAlignedBoundingBox}, {@link BoundingRectangle}, {@link BoundingSphere}, and the {@link OrientedBoundingBox} ,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within all bounding objects.
     */
    CameraLimiter.prototype.withinAllBoundingObjects = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.axisAligned) && !defined(this.boundingObject.boundingRectangle)
            && !defined(this.boundingObject.boundingSphere) && !defined(this.boundingObject.orientedBoundingSphere)) {
            throw new DeveloperError('at least one bounding object required');
        }
        //>>includeEnd('debug');

        var within = true;
        if (defined(this.axisAligned)) {
            within &= this.withinAxisAligned(positionToCheck);
        }
        if (defined(this.boundingRectangle)) {
            within &= this.withinBoundingRectangle(positionToCheck);
        }
        if (defined(this.boundingSphere)) {
            within &= this.withinBoundingSphere(positionToCheck);
        }
        if (defined(this.orientedBoundingBox)) {
            within &= this.withinOrientedBoundingBox(positionToCheck);
        }

        return within;
    }

    /**
     * Checks if the inputted Cartesian3 is within at least one bounding object used for this limiter.
     * These bounding objects can be any of the following {@link AxisAlignedBoundingBox}, {@link BoundingRectangle},
     * {@link BoundingSphere}, and {@link OrientedBoundingBox}.
     * <code>true</code> if the inputted Cartesian3 is within any of the following components if they are defined:
     * {@link AxisAlignedBoundingBox}, {@link BoundingRectangle}, {@link BoundingSphere}, and the {@link OrientedBoundingBox} ,
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within at least one of the bounding objects.
     */
    CameraLimiter.prototype.withinAtLeastOneBoundingObject = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.axisAligned) && !defined(this.boundingObject.boundingRectangle)
            && !defined(this.boundingObject.boundingSphere) && !defined(this.boundingObject.orientedBoundingSphere)) {
            throw new DeveloperError('at least one bounding object required');
        }
        //>>includeEnd('debug');

        var within = true;
        if (defined(this.axisAligned)) {
            within |= this.withinAxisAligned(positionToCheck);
        }
        if (defined(this.boundingRectangle)) {
            within |= this.withinBoundingRectangle(positionToCheck);
        }
        if (defined(this.boundingSphere)) {
            within |= this.withinBoundingSphere(positionToCheck);
        }
        if (defined(this.orientedBoundingBox)) {
            within |= this.withinOrientedBoundingBox(positionToCheck);
        }

        return within;
    }

    /**
     * Checks if the inputted Cartesian3 is within the {@link AxisAlignedBoundingBox} defined for this limiter.
     * <code>true</code> if the inputted Cartesian3 is within the {@link AxisAlignedBoundingBox},
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within the {@link AxisAlignedBoundingBox} defined for this limiter.
     */
    CameraLimiter.prototype.withinAxisAligned = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.axisAligned)) {
            throw new DeveloperError('axisAlignedBoundingBox is required.');
        }
        if (!defined(this.axisAligned.minimum)) {
            throw new DeveloperError('minimum of axisAlignedBoundingBox is required.');
        }
        if (!defined(this.axisAligned.maximum)) {
            throw new DeveloperError('maximum of axisAlignedBoundingBox is required.');
        }
        if (!defined(this.axisAligned.center)){
            throw new DeveloperError('center of axisAlignedBoundingBox is required.');
        }
        //>>includeEnd('debug');

        var positionVsAxisMinimumCheck = positionToCheck - this.axisAligned.minimum;
        var positionVsAxisMaximumCheck = this.axisAligned.maximum - positionToCheck;

        return (positionVsAxisMinimumCheck.x >= 0 && positionVsAxisMinimumCheck.y >= 0 && positionVsAxisMinimumCheck.z >= 0)
               && (positionVsAxisMaximumCheck.x >= 0 && positionVsAxisMaximumCheck.y >= 0 && positionVsAxisMaximumCheck.z >= 0);
    };

    /**
     * Checks if the inputted Cartesian3 is within the {@link BoundingRectangle} defined for this limiter.
     * <code>true</code> if the inputted Cartesian3 is within the {@link BoundingRectangle},
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within the {@link BoundingRectangle} defined for this limiter.
     */
    CameraLimiter.prototype.withinBoundingRectangle = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingRectangle)) {
            throw new DeveloperError('boundingRectangle is required.');
        }
        if (!defined(this.boundingRectangle.x)) {
            throw new DeveloperError('x of boundingRectangle is required.');
        }
        if (!defined(this.boundingRectangle.y)) {
            throw new DeveloperError('y of boundingRectangle is required.');
        }
        if (!defined(this.boundingRectangle.width)){
            throw new DeveloperError('width of boundingRectangle is required.');
        }
        if (!defined(this.boundingRectangle.height)){
            throw new DeveloperError('height of boundingRectangle is required.');
        }
        //>>includeEnd('debug');

        var rect = this.boundingRectangle;

        var minimum = new Cartesian2(rect.x, rect.y);
        var maximum = new Cartesian2(rect.x + rect.width, rect.y + rect.height);
        var position = new Cartesian2(positionToCheck.x, positionToCheck.y);

        var positionVsMinimumCheck = position - minimum;
        var positionVsMaximumCheck = maximum - position;

        return (positionVsMinimumCheck.x >= 0 && positionVsMinimumCheck.y >= 0) && (positionVsMaximumCheck.x >= 0 && positionVsMaximumCheck.y >= 0);
    };

    /**
     * Checks if the inputted Cartesian3 is within the {@link BoundingSphere} defined for this limiter.
     * <code>true</code> if the inputted Cartesian3 is within the {@link BoundingSphere},
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within the {@link BoundingSphere} defined for this limiter.
     */
    CameraLimiter.prototype.withinBoundingSphere = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingSphere)) {
            throw new DeveloperError('boundingSphere is required.');
        }
        if (!defined(this.boundingSphere.radius)) {
            throw new DeveloperError('radius of bounding sphere is required.');
        }
        if (!defined(this.boundingSphere.center)) {
            throw new DeveloperError('center of bounding sphere is required.');
        }
        //>>includeEnd('debug');

        var radius = this.boundingSphere.radius;
        var distanceToCenter = Cartesian3.distance(positionToCheck, this.boundingSphere.center);

        return (distanceToCenter.x <= radius && distanceToCenter.y <= radius && distanceToCenter.z <= radius);

    };

    /**
     * Checks if the inputted Cartesian3 is within the {@link OrientedBoundingBox} defined for this limiter.
     * <code>true</code> if the inputted Cartesian3 is within the {@link OrientedBoundingBox},
     * <code>false</code> otherwise.
     *
     * @param {Cartesian3} [positionToCheck] The Cartesian3 location being checked
     * @returns {Boolean} <code>true</code> if the positionToCheck is within the {@link OrientedBoundingBox} defined for this limiter.
     */
    CameraLimiter.prototype.withinOrientedBoundingBox = function(positionToCheck) {
        this._positionAndElementsDefined(positionToCheck);
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.orientedBoundingBox)) {
            throw new DeveloperError('orientedBoundingBox is required.');
        }
        if (!defined(this.orientedBoundingBox.center)) {
            throw new DeveloperError('center of orientedBoundingBox is required.');
        }
        if (!defined(this.boundingSphere.halfAxes)) {
            throw new DeveloperError('halfAxes of orientedBoundingBox is required.');
        }
        //>>includeEnd('debug');

        // convert world space positionToCheck to orientedBoundingBox's object space.
        var inverseTransformationMatrix;
        if (this.boundingSphere.halfAxes.equals(Matrix3.ZERO)) {
            return false;
        }
        Matrix3.inverse(this.boundingSphere.halfAxes, inverseTransformationMatrix);
        var positionInObjectSpace = inverseTransformationMatrix * positionToCheck;

        // once in object space just check if converted location is within axis oriented unit cube
        var minimum = new Cartesian3(-0.5, -0.5, -0.5);
        var maximum = new Cartesian3(0.5, 0.5, 0.5);
        var positionVsAxisMinimumCheck = positionInObjectSpace - minimum;
        var positionVsAxisMaximumCheck = maximum - positionInObjectSpace;

        return (positionVsAxisMinimumCheck.x >= 0 && positionVsAxisMinimumCheck.y >= 0 && positionVsAxisMinimumCheck.z >= 0)
               && (positionVsAxisMaximumCheck.x >= 0 && positionVsAxisMaximumCheck.y >= 0 && positionVsAxisMaximumCheck.z >= 0);
    };

    CameraLimiter.prototype.withinCoordinateLimits = function(coordinateToCheck) {

    };

    CameraLimiter.prototype.withinHeadingPitchRollLimits = function(headingPitchRollToCheck) {

    };

    CameraLimiter.prototype.withinHeadingLimits = function(headingToCheck) {

    };

    CameraLimiter.prototype.withinPitchLimits = function(headingToCheck) {

    };

    CameraLimiter.prototype.withinRollLimits = function(headingToCheck) {

    };

    defineProperties(CameraLimiter.prototype, {
        /**
         * Gets the camera's reference frame. The inverse of this transformation is appended to the view matrix.
         * @memberof Camera.prototype
         *
         * @type {Matrix4}
         * @readonly
         *
         * @default {@link Matrix4.IDENTITY}
         */
        transform : {
            get : function() {
                return this._transform;
            }
        },

    });

    /**
     * Duplicates this CameraLimiter instance.
     *
     * @param {CameraLimiter} [result] The object onto which to store the result.
     * @returns {CameraLimiter} The modified result parameter or a new CameraLimiter instance if one was not provided.
     */
    CameraLimiter.prototype.clone = function(result) {
        return CameraLimiter._clone(this, result);
    };

    /**
     * @private
     */
    CameraLimiter._clone = function(limiter, result) {
        if (!defined(result)) {
            result = new CameraLimiter();
        }

        AxisAlignedBoundingBox.clone(limiter.boundingObject.axisAligned, result.boundingObject.axisAligned);
        BoundingRectangle.clone(limiter.boundingObject.boundingRectangle, result.boundingObject.boundingRectangle);
        BoundingSphere.clone(limiter.boundingObject.boundingSphere, result.boundingObject.boundingSphere);
        OrientedBoundingBox.clone(limiter.boundingObject.orientedBoundingBox, result.boundingObject.orientedBoundingBox);

        result.coordinateLimits.minLatitude = limiter.coordinateLimits.minLatitude;
        result.coordinateLimits.maxLatitude = limiter.coordinateLimits.maxLatitude;
        result.coordinateLimits.minLongitude = limiter.coordinateLimits.minLongitude;
        result.coordinateLimits.maxLongitude = limiter.coordinateLimits.maxLongitude;

        HeadingPitchRoll.clone(limiter.headingPitchRollLimits.minHeadingPitchRoll, result.headingPitchRollLimits.minHeadingPitchRoll);
        HeadingPitchRoll.clone(limiter.headingPitchRollLimits.maxHeadingPitchRoll, result.headingPitchRollLimits.maxHeadingPitchRoll);

        result.headingPitchRollLimits.minHeading = limiter.headingPitchRollLimits.minHeading;
        result.headingPitchRollLimits.maxHeading = limiter.headingPitchRollLimits.maxHeading;
        result.headingPitchRollLimits.minPitch = limiter.headingPitchRollLimits.minPitch;
        result.headingPitchRollLimits.maxPitch = limiter.headingPitchRollLimits.maxPitch;
        result.headingPitchRollLimits.minRoll = limiter.headingPitchRollLimits.minRoll;
        result.headingPitchRollLimits.maxRoll = limiter.headingPitchRollLimits.maxRoll;

        return result;
    };

    return CameraLimiter;
});
