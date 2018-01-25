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
        '../Core/OrientedBoundingBox'
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
        OrientedBoundingBox) {
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
        // turn it into just one boundingObject that allows to be an axisAligned|boundingRectangle|boundingSphere|orientedBoundingBox types
        this.boundingObject = undefined;
        this.coordinateLimits = {
            /**
             * minimum values for the coordinate limits
             *
             * @type {Cartographic}
             */
            minimum : undefined,
            /**
             * maximum values for the coordinate limits
             *
             * @type {Cartographic}
             */
            maximum : undefined
        };
        this.headingPitchRollLimits = {
            /**
             * minimum values for the heading, pitch, roll limits
             *
             * @type {HeadingPitchRoll}
             */
            minimum : undefined,
            /**
             * maximum values for the heading, pitch, roll limits
             *
             * @type {HeadingPitchRoll}
             */
            maximum : undefined
        };
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
    CameraLimiter.prototype.withinBoundingObject = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject)) {
            throw new DeveloperError('bounding object is required');
        }
        if (!defined(positionToCheck)) {
            throw new DeveloperError('positionToCheck is required.');
        }
        if (!defined(positionToCheck.x)) {
            throw new DeveloperError('x is required.');
        }
        if (!defined(positionToCheck.y)) {
            throw new DeveloperError('y is required.');
        }
        if (!defined(positionToCheck.z)) {
            throw new DeveloperError('z is required.');
        }
        //>>includeEnd('debug');

        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            return this._withinAxisAligned(positionToCheck);
        } else if (this.boundingObject instanceof BoundingRectangle) {
            return this._withinBoundingRectangle(positionToCheck);
        } else if (this.boundingObject instanceof BoundingSphere) {
            return this._withinBoundingSphere(positionToCheck);
        } else if (this.boundingObject instanceof OrientedBoundingBox) {
            return this._withinOrientedBoundingBox(positionToCheck);
        }

        //>>includeStart('debug', pragmas.debug);
        throw new DeveloperError('bounding object is not of an allowed type');
        //>>includeEnd('debug');
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinAxisAligned = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.minimum)) {
            throw new DeveloperError('minimum of axisAlignedBoundingBox is required.');
        }
        if (!defined(this.boundingObject.maximum)) {
            throw new DeveloperError('maximum of axisAlignedBoundingBox is required.');
        }
        if (!defined(this.boundingObject.center)){
            throw new DeveloperError('center of axisAlignedBoundingBox is required.');
        }
        //>>includeEnd('debug');

        var positionVsAxisMinimumCheck = positionToCheck - this.axisAligned.minimum;
        var positionVsAxisMaximumCheck = this.axisAligned.maximum - positionToCheck;

        return (positionVsAxisMinimumCheck.x >= 0 && positionVsAxisMinimumCheck.y >= 0 && positionVsAxisMinimumCheck.z >= 0)
               && (positionVsAxisMaximumCheck.x >= 0 && positionVsAxisMaximumCheck.y >= 0 && positionVsAxisMaximumCheck.z >= 0);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinBoundingRectangle = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.x)) {
            throw new DeveloperError('x of boundingRectangle is required.');
        }
        if (!defined(this.boundingObject.y)) {
            throw new DeveloperError('y of boundingRectangle is required.');
        }
        if (!defined(this.boundingObject.width)){
            throw new DeveloperError('width of boundingRectangle is required.');
        }
        if (!defined(this.boundingObject.height)){
            throw new DeveloperError('height of boundingRectangle is required.');
        }
        //>>includeEnd('debug');

        var rect = this.boundingObject;

        var minimum = new Cartesian2(rect.x, rect.y);
        var maximum = new Cartesian2(rect.x + rect.width, rect.y + rect.height);
        var position = new Cartesian2(positionToCheck.x, positionToCheck.y);

        var positionVsMinimumCheck = position - minimum;
        var positionVsMaximumCheck = maximum - position;

        return (positionVsMinimumCheck.x >= 0 && positionVsMinimumCheck.y >= 0)
               && (positionVsMaximumCheck.x >= 0 && positionVsMaximumCheck.y >= 0);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinBoundingSphere = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.radius)) {
            throw new DeveloperError('radius of bounding sphere is required.');
        }
        if (!defined(this.boundingObject.center)) {
            throw new DeveloperError('center of bounding sphere is required.');
        }
        //>>includeEnd('debug');

        var radius = this.boundingObject.radius;
        var distanceToCenter = Cartesian3.distance(positionToCheck, this.boundingObject.center);

        return (distanceToCenter.x <= radius && distanceToCenter.y <= radius && distanceToCenter.z <= radius);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinOrientedBoundingBox = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.boundingObject.center)) {
            throw new DeveloperError('center of orientedBoundingBox is required.');
        }
        if (!defined(this.boundingObject.halfAxes)) {
            throw new DeveloperError('halfAxes of orientedBoundingBox is required.');
        }
        //>>includeEnd('debug');

        // convert world space positionToCheck to orientedBoundingBox's object space.
        if (this.boundingObject.halfAxes.equals(Matrix3.ZERO)) {
            return false;
        }
        var inverseTransformationMatrix = Matrix3.IDENTITY;
        Matrix3.inverse(this.boundingObject.halfAxes, inverseTransformationMatrix);
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
     * Checks if the defined components of the inputted {@link Cartesian3} or {@link Cartographic} element is within the defined components of
     * {@Cartographic} minimum and maximum Coordinates for this limiter.
     * <code>true</code> if the defined components of the inputted value are within the defined components of those for the limiter,
     * <code>false</code> otherwise.
     *
     * @param {Cartographic} [valueToCheck] The {@link Cartesian3} or {@link Cartographic} corresponding to the location being checked
     * @returns {Boolean} <code>true</code> if the [valueToCheck] location is within the defined minimum and maximum coordinates of the limiter.
     */
    CameraLimiter.prototype.withinCoordinateLimits = function(valueToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(valueToCheck)) {
            throw new DeveloperError('valueToCheck is required.');
        }
        //>>includeEnd('debug');

        this._allLimiterMaxMinPairsMatched();

        var value;
        if (valueToCheck instanceof Cartographic) {
            value = valueToCheck;
        } else if (valueToCheck instanceof Cartesian3) {
            value = Cartographic.fromCartesian(valueToCheck);
        } else {
            throw new DeveloperError('valueToCheck must be only of type Cartesian3 or Cartographic');
        }

        var minLimits = this.coordinateLimits.minimum;

        var within = true;
        // due to allLimiterMaxMinPairsMatched - if min exists, max must exist
        if (defined(minLimits.longitude)) {
            within &= this._withinLongitude(value.longitude);
        }
        if (defined(minLimits.latitude)) {
            within &= this._withinLatitude(value.latitude);
        }
        if (defined(minLimits.height)) {
            within &= this._withinHeight(value.height);
        }

        return within;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinLongitude = function(longitudeToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(longitudeToCheck)) {
            throw new DeveloperError('longitudeToCheck is required.');
        }
        //>>includeEnd('debug');

        return (longitudeToCheck >= this.coordinateLimits.minimum.longitude && longitudeToCheck <= this.coordinateLimits.maximum.longitude);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinLatitude = function(latitudeToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(latitudeToCheck)) {
            throw new DeveloperError('latitudeToCheck is required.');
        }
        //>>includeEnd('debug');

        return (latitudeToCheck >= this.coordinateLimits.minimum.latitude && latitudeToCheck <= this.coordinateLimits.maximum.latitude);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinHeight = function(heightToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(heightToCheck)) {
            throw new DeveloperError('heightToCheck is required.');
        }
        //>>includeEnd('debug');

        return (heightToCheck >= this.coordinateLimits.minimum.height && heightToCheck <= this.coordinateLimits.maximum.height);
    };

    /**
     * Checks if the inputted {@link HeadingPitchRoll} is within the minimum and maximum {@link HeadingPitchRoll} values defined for this limiter.
     * <code>true</code> if the inputted {@link HeadingPitchRoll} is within the {@link HeadingPitchRoll} values for this limiter,
     * <code>false</code> otherwise.
     *
     * @param {HeadingPitchRoll} [valueToCheck] Corresponds to the @link HeadingPitchRoll} being checked
     * @returns {Boolean} <code>true</code> if the {@link HeadingPitchRoll} is within the {@link HeadingPitchRoll} values defined for this limiter.
     */
    CameraLimiter.prototype.withinHeadingPitchRollLimits = function(valueToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(valueToCheck)) {
            throw new DeveloperError('headingPitchRollToCheck is required.');
        }
        //>>includeEnd('debug');

        this._allLimiterMaxMinPairsMatched();

        var minLimits = this.headingPitchRollLimits.minimum;

        var within = true;
        // due to allLimiterMaxMinPairsMatched - if min exists, max must exist
        if (defined(minLimits.heading)) {
            within &= this._withinHeading(valueToCheck.heading);
        }
        if (defined(minLimits.pitch)) {
            within &= this._withinPitch(valueToCheck.pitch);
        }
        if (defined(minLimits.roll)) {
            within &= this._withinRoll(valueToCheck.roll);
        }

        return within;
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinHeading = function(headingToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(headingToCheck)) {
            throw new DeveloperError('headingToCheck is required.');
        }
        //>>includeEnd('debug');

        return (headingToCheck >= this.headingPitchRollLimits.minimum.heading && headingToCheck <= this.headingPitchRollLimits.heading);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinPitch = function(pitchToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(pitchToCheck)) {
            throw new DeveloperError('pitchToCheck is required.');
        }
        //>>includeEnd('debug');

        return (pitchToCheck >= this.headingPitchRollLimits.minimum.pitch && pitchToCheck <= this.headingPitchRollLimits.maximum.pitch);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinRoll = function(rollToCheck) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(rollToCheck)) {
            throw new DeveloperError('rollToCheck is required.');
        }
        //>>includeEnd('debug');

        return (rollToCheck >= this.headingPitchRollLimits.minimum.roll && rollToCheck <= this.headingPitchRollLimits.maximum.roll);
    };

    /**
     * @private
     */
    CameraLimiter.prototype._allLimiterMaxMinPairsMatched = function() {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(this.coordinateLimits.minimum) && defined(this.coordinateLimits.maximum)) {
            throw new DeveloperError('minimum is required.');
        }
        if (!defined(this.coordinateLimits.maximum) && defined(this.coordinateLimits.minimum)) {
            throw new DeveloperError('maximum is required.');
        }
        if (!defined(this.coordinateLimits.minimum.longitude) && defined(this.coordinateLimits.maximum.longitude)) {
            throw new DeveloperError('minimum.longitude is required.');
        }
        if (defined(this.coordinateLimits.minimum.longitude) && !defined(this.coordinateLimits.maximum.longitude)) {
            throw new DeveloperError('maximum.longitude is required.');
        }
        if (!defined(this.coordinateLimits.minimum.latitude) && defined(this.coordinateLimits.maximum.latitude)) {
            throw new DeveloperError('minimum.latitude is required.');
        }
        if (defined(this.coordinateLimits.minimum.latitude) && !defined(this.coordinateLimits.maximum.latitude)) {
            throw new DeveloperError('maximum.latitude is required.');
        }
        if (!defined(this.coordinateLimits.minimum.height) && defined(this.coordinateLimits.maximum.height)) {
            throw new DeveloperError('minimum.height is required.');
        }
        if (defined(this.coordinateLimits.minimum.height) && !defined(this.coordinateLimits.maximum.height)) {
            throw new DeveloperError('maximum.height is required.');
        }

        if (!defined(this.headingPitchRollLimits)) {
            throw new DeveloperError('headingPitchRollLimits is required.');
        }
        if (!defined(this.headingPitchRollLimits.minimum) && defined(this.headingPitchRollLimits.maximum)) {
            throw new DeveloperError('minimum is required.');
        }
        if (defined(this.headingPitchRollLimits.minimum) && !defined(this.headingPitchRollLimits.maximum)) {
            throw new DeveloperError('maximum is required.');
        }
        if (!defined(this.headingPitchRollLimits.minimum.heading) && defined(this.headingPitchRollLimits.maximum.heading)) {
            throw new DeveloperError('minimum.heading is required.');
        }
        if (defined(this.headingPitchRollLimits.minimum.heading) && !defined(this.headingPitchRollLimits.maximum.heading)) {
            throw new DeveloperError('maximum.heading is required.');
        }
        if (!defined(this.headingPitchRollLimits.minimum.pitch) && defined(this.headingPitchRollLimits.maximum.pitch)) {
            throw new DeveloperError('minimum.pitch is required.');
        }
        if (defined(this.headingPitchRollLimits.minimum.pitch) && !defined(this.headingPitchRollLimits.maximum.pitch)) {
            throw new DeveloperError('maximum.pitch is required.');
        }
        if (!defined(this.headingPitchRollLimits.minimum.roll) && defined(this.headingPitchRollLimits.maximum.roll)) {
            throw new DeveloperError('minimum.roll is required.');
        }
        if (defined(this.headingPitchRollLimits.minimum.roll) && !defined(this.headingPitchRollLimits.maximum.roll)) {
            throw new DeveloperError('maximum.roll is required.');
        }
        //>>includeEnd('debug');

        return true;
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

        if (!defined(limiter.boundingObject)) {
            result.boundingObject = undefined;
        } else if (limiter.boundingObject instanceof AxisAlignedBoundingBox) {
            AxisAlignedBoundingBox.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof BoundingRectangle) {
            BoundingRectangle.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof BoundingSphere) {
            BoundingSphere.clone(limiter.boundingObject, result.boundingObject);
        } else if (limiter.boundingObject instanceof OrientedBoundingBox) {
            OrientedBoundingBox.clone(limiter.boundingObject, result.boundingObject);
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('bounding object is not of an allowed type');
            //>>includeEnd('debug');
        }

        result.coordinateLimits.minLatitude = limiter.coordinateLimits.minLatitude;
        result.coordinateLimits.maxLatitude = limiter.coordinateLimits.maxLatitude;
        result.coordinateLimits.minLongitude = limiter.coordinateLimits.minLongitude;
        result.coordinateLimits.maxLongitude = limiter.coordinateLimits.maxLongitude;

        HeadingPitchRoll.clone(limiter.headingPitchRollLimits.minimum, result.headingPitchRollLimits.minimum);
        HeadingPitchRoll.clone(limiter.headingPitchRollLimits.maximum, result.headingPitchRollLimits.maximum);

        result.headingPitchRollLimits.minHeading = limiter.headingPitchRollLimits.minHeading;
        result.headingPitchRollLimits.maxHeading = limiter.headingPitchRollLimits.maxHeading;

        return result;
    };

    return CameraLimiter;
});
