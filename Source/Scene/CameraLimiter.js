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
            maxHeadingPitchRoll : undefined
        };
    }

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
    };

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
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.axisAligned) && !defined(this.boundingObject.boundingRectangle)
            && !defined(this.boundingObject.boundingSphere) && !defined(this.boundingObject.orientedBoundingBox)) {
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
    };

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
    };

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
        if (this.boundingSphere.halfAxes.equals(Matrix3.ZERO)) {
            return false;
        }
        var inverseTransformationMatrix = Matrix3.IDENTITY;
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

    /**
     * Checks if the inputted longitude and latitude values are within the minimum and maximum longitude and latitude values defined for this limiter.
     * <code>true</code> if the inputted longitude and latitude values are within the limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [latitudeToCheck] The number corresponding to the latitude location being checked
     * @param {Number} [longitudeToCheck] The number corresponding to the longitude location being checked
     * @returns {Boolean} <code>true</code> if the longitudeToCheck and latitudeToCheck are within the longitudes and latitudes defined for this limiter.
     */
    CameraLimiter.prototype.withinCoordinateLimits = function(longitudeToCheck, latitudeToCheck) {
        return (this.withinLongitude(longitudeToCheck) && this.withinLatitude(latitudeToCheck));
    };

    /**
     * Checks if the inputted longitude value is within the minimum and maximum longitude values defined for this limiter.
     * <code>true</code> if the inputted longitude is within the limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [longitudeToCheck] The number corresponding to the longitude location being checked
     * @returns {Boolean} <code>true</code> if the longitudeToCheck is within the longitudes defined for this limiter.
     */
    CameraLimiter.prototype.withinLongitude = function(longitudeToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(longitudeToCheck)) {
            throw new DeveloperError('longitudeToCheck is required.');
        }
        if (!defined(this.coordinateLimits.minLongitude)) {
            throw new DeveloperError('minLongitude is required.');
        }
        if (!defined(this.coordinateLimits.maxLongitude)) {
            throw new DeveloperError('maxLongitude is required.');
        }
        //>>includeEnd('debug');

        return (longitudeToCheck >= this.coordinateLimits.minLongitude && longitudeToCheck <= this.coordinateLimits.maxLongitude);
    };

    /**
     * Checks if the inputted latitude value is within the minimum and maximum latitude values defined for this limiter.
     * <code>true</code> if the inputted latitude is within the limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [latitudeToCheck] The number corresponding to the latitude location being checked
     * @returns {Boolean} <code>true</code> if the latitudeToCheck is within the latitudes defined for this limiter.
     */
    CameraLimiter.prototype.withinLatitude = function(latitudeToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(latitudeToCheck)) {
            throw new DeveloperError('latitudeToCheck is required.');
        }
        if (!defined(this.coordinateLimits.minLatitude)) {
            throw new DeveloperError('minLatitude is required.');
        }
        if (!defined(this.coordinateLimits.maxLatitude)) {
            throw new DeveloperError('maxLatitude is required.');
        }
        //>>includeEnd('debug');

        return (latitudeToCheck >= this.coordinateLimits.minLatitude && latitudeToCheck <= this.coordinateLimits.maxLatitude);
    };

    /**
     * Checks if the inputted {@link HeadingPitchRoll} is within the minimum and maximum {@link HeadingPitchRoll} values defined for this limiter.
     * <code>true</code> if the inputted {@link HeadingPitchRoll} is within the {@link HeadingPitchRoll} values for this limiter,
     * <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [headingPitchRollToCheck] Corresponds to the @link HeadingPitchRoll} being checked
     * @returns {Boolean} <code>true</code> if the {@link HeadingPitchRoll} is within the {@link HeadingPitchRoll} values defined for this limiter.
     */
    CameraLimiter.prototype.withinHeadingPitchRollLimits = function(headingPitchRollToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(headingPitchRollToCheck)) {
            throw new DeveloperError('headingPitchRollToCheck is required.');
        }
        //>>includeEnd('debug');

        return (this.withinHeadingLimits(headingPitchRollToCheck.heading)
                && this.withinPitchLimits(headingPitchRollToCheck.pitch)
                && this.withinRollLimits(headingPitchRollToCheck.roll)
        );
    };

    /**
     * Checks if the inputted heading is within the minimum and maximum heading values defined for this limiter.
     * <code>true</code> if the inputted heading is within the heading values for this limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [headingToCheck] Corresponds to the heading being checked
     * @returns {Boolean} <code>true</code> if the inputted heading is within the heading values defined for this limiter.
     */
    CameraLimiter.prototype.withinHeadingLimits = function(headingToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(headingToCheck)) {
            throw new DeveloperError('headingToCheck is required.');
        }
        if (!defined(this.headingPitchRollLimits.minHeadingPitchRoll.heading)) {
            throw new DeveloperError('minHeadingPitchRoll.heading is required.');
        }
        if (!defined(this.headingPitchRollLimits.maxHeadingPitchRoll.heading)) {
            throw new DeveloperError('maxHeadingPitchRoll.heading is required.');
        }
        //>>includeEnd('debug');

        var limiterMin = this.headingPitchRollLimits.minHeadingPitchRoll;
        var limiterMax = this.headingPitchRollLimits.maxHeadingPitchRoll;
        return (headingToCheck >= limiterMin.heading && headingToCheck <= limiterMax.heading);
    };

    /**
     * Checks if the inputted pitch is within the minimum and maximum pitch values defined for this limiter.
     * <code>true</code> if the inputted pitch is within the heading values for this limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [pitchToCheck] Corresponds to the pitch being checked
     * @returns {Boolean} <code>true</code> if the inputted pitch is within the pitch values defined for this limiter.
     */
    CameraLimiter.prototype.withinPitchLimits = function(pitchToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(pitchToCheck)) {
            throw new DeveloperError('pitchToCheck is required.');
        }
        if (!defined(this.headingPitchRollLimits.minHeadingPitchRoll.pitch)) {
            throw new DeveloperError('minHeadingPitchRoll.pitch is required.');
        }
        if (!defined(this.headingPitchRollLimits.maxHeadingPitchRoll.pitch)) {
            throw new DeveloperError('maxHeadingPitchRoll.pitch is required.');
        }
        //>>includeEnd('debug');

        var limiterMin = this.headingPitchRollLimits.minHeadingPitchRoll;
        var limiterMax = this.headingPitchRollLimits.maxHeadingPitchRoll;
        return (pitchToCheck >= limiterMin.pitch && pitchToCheck <= limiterMax.pitch);
    };

    /**
     * Checks if the inputted roll is within the minimum and maximum roll values defined for this limiter.
     * <code>true</code> if the inputted roll is within the roll values for this limiter,
     * <code>false</code> otherwise.
     *
     * @param {Number} [rollToCheck] Corresponds to the roll being checked
     * @returns {Boolean} <code>true</code> if the inputted roll is within the roll values defined for this limiter.
     */
    CameraLimiter.prototype.withinRollLimits = function(rollToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(rollToCheck)) {
            throw new DeveloperError('rollToCheck is required.');
        }
        if (!defined(this.headingPitchRollLimits.minHeadingPitchRoll.roll)) {
            throw new DeveloperError('minHeadingPitchRoll.roll is required.');
        }
        if (!defined(this.headingPitchRollLimits.maxHeadingPitchRoll.pitch)) {
            throw new DeveloperError('maxHeadingPitchRoll.roll is required.');
        }
        //>>includeEnd('debug');

        var limiterMin = this.headingPitchRollLimits.minHeadingPitchRoll;
        var limiterMax = this.headingPitchRollLimits.maxHeadingPitchRoll;
        return (rollToCheck >= limiterMin.roll && rollToCheck <= limiterMax.roll);
    };

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

        return result;
    };

    return CameraLimiter;
});
