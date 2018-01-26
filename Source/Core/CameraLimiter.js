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

        // turn it into just one boundingObject that allows to be an axisAligned|boundingRectangle|boundingSphere|orientedBoundingBox types
        this.boundingObject = options.boundingObject;

        this.minHeadingPitchRoll = options.minimumHeadingPitchRoll;
        this.maxHeadingPitchRoll = options.maximumHeadingPitchRoll;

        // use boundingObject - if attribute not defined - infinity
        // boundingObject - oriented bounding box - from rectangle - can do cartesian check for nsew
    }

    /**
     * TO FILL INT STILL -
     * TODO-------COMPLETE THIS DOCUMENTATION
     * GivenConstraints - returns closest valid location to inputted location
     */
    CameraLimiter.prototype.closestLocationTo = function(positionToCheck) {
        Check.defined('positionToCheck', positionToCheck);

        if (!defined(this.boundingObject) || this._withinBoundingObject(positionToCheck)) {
            return positionToCheck;
        }

        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            // axis aligned has center, min and max cartesian3 locations
        } else if (this.boundingObject instanceof BoundingRectangle) {
            // bounding rectangle has x, y, width, height
        } else if (this.boundingObject instanceof BoundingSphere) {
            // bounding sphere has center, radius
        } else if (this.boundingObject instanceof OrientedBoundingBox) {
            // oriented bounding box has center and matrix3 of half axes (axes directions of half length than full visual (ie originating from center of oriented cube)
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('Bounding Object not of allowed type. '
                                     + 'Must be AxisAlignedBoundingBox|BoundingRectangle|BoundingSphere|OrientedBoundingBox');
            //>>includeEnd('debug');
        }
    };

    /**
     * @private
     */
    CameraLimiter.prototype._withinBoundingObject = function(positionToCheck) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('this.boundingObject', this.boundingObject);
        if (!(positionToCheck instanceof Cartesian3) && !(positionToCheck instanceof Cartographic)) {
            throw new DeveloperError('positionToCheck required to be of type Cartesian3 or Cartographic.');
        }
        //>>includeEnd('debug');

        var value;
        if (positionToCheck instanceof Cartographic) {
            value = Cartesian3.fromRadians(positionToCheck.longitude, positionToCheck.latitude, positionToCheck.height);
        } else if (positionToCheck instanceof Cartesian3) {
            value = positionToCheck;
        } else {
            throw new DeveloperError('valueToCheck must be only of type Cartesian3 or Cartographic');
        }

        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            return this._withinAxisAligned(value);
        } else if (this.boundingObject instanceof BoundingRectangle) {
            return this._withinBoundingRectangle(value);
        } else if (this.boundingObject instanceof BoundingSphere) {
            return this._withinBoundingSphere(value);
        } else if (this.boundingObject instanceof OrientedBoundingBox) {
            return this._withinOrientedBoundingBox(value);
        }

        //>>includeStart('debug', pragmas.debug);
        throw new DeveloperError('bounding object is not of an allowed type');
        //>>includeEnd('debug');
    };

    /**
     * TO FILL INT STILL - TODO-------------------
     * GivenConstraints - returns closest valid orientation to inputted orientation
     */
    CameraLimiter.prototype.closestOrientationTo = function(orientationToCheck) {
// TODO ------------------check completed?
        if(this.withinHeadingPitchRollLimits(orientationToCheck)) {
            return orientationToCheck;
        }

        this.allLimiterValuesCreatedProperly();

        // allLimiterValuesCreatedProperly means that if a min is defined, max must also be.
        var headingDefined = defined(this.minimum.heading);
        var pitchDefined = defined(this.minimum.pitch);
        var rollDefined = defined(this.minimum.roll);

        var returningOrientation = orientationToCheck;
        if (headingDefined && !this._withinHeading(orientationToCheck.heading)) {
            if (returningOrientation.heading < this.minimum.heading) {
                returningOrientation.heading = this.minimum.heading;
            } else if (returningOrientation.heading > this.maximum.heading) {
                returningOrientation.heading = this.maximum.heading;
            }
        }
        if (pitchDefined && !this._withinPitch(orientationToCheck.pitch)) {
            if (returningOrientation.pitch < this.minimum.pitch) {
                returningOrientation.pitch = this.minimum.pitch;
            } else if (returningOrientation.pitch > this.maximum.pitch) {
                returningOrientation.pitch = this.maximum.pitch;
            }
        }
        if (rollDefined && !this._withinRoll(orientationToCheck.roll)) {
            if (returningOrientation.roll < this.minimum.roll) {
                returningOrientation.roll = this.minimum.roll;
            } else if (returningOrientation.roll > this.maximum.roll) {
                returningOrientation.roll = this.maximum.roll;
            }
        }

        return returningOrientation;
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
        if (!(valueToCheck instanceof HeadingPitchRoll)) {
            throw new DeveloperError('valueToCheck must be of type HeadingPitchRoll.');
        }
        //>>includeEnd('debug');

        this.allLimiterValuesCreatedProperly();

        var within = true;
        // due to allLimiterValuesCreatedProperly - if min exists, max must exist
        if (defined(this.minimum.heading)) {
            within &= this._withinHeading(valueToCheck.heading);
        }
        if (defined(this.minimum.pitch)) {
            within &= this._withinPitch(valueToCheck.pitch);
        }
        if (defined(this.minimum.roll)) {
            within &= this._withinRoll(valueToCheck.roll);
        }

        return !!within; // so returned as a boolean instead of bitwise result
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

        return (headingToCheck >= this.minimum.heading && headingToCheck <= this.maximum.heading);
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

        return (pitchToCheck >= this.minimum.pitch && pitchToCheck <= this.maximum.pitch);
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

        return (rollToCheck >= this.minimum.roll && rollToCheck <= this.maximum.roll);
    };

    /**
     * @private
     */
    CameraLimiter._minAndMaxOfHeadingPitchRollMatched = function(limiter) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined('limiter', limiter);

        if (!defined(limiter.minHeadingPitchRoll) && defined(limiter.maxHeadingPitchRoll)) {
            throw new DeveloperError('minHeadingPitchRoll is required.');
        }
        if (!defined(limiter.maxHeadingPitchRoll) && defined(limiter.minHeadingPitchRoll)) {
            throw new DeveloperError('maxHeadingPitchRoll is required.');
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

        limiter.allLimiterValuesCreatedProperly();

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

        if (defined(limiter.minimum)) {
            // because of allLimiterValuesCreatedProperly - if min exists, max must too
            var min = limiter.minimum;
            var max = limiter.maximum;

            if (defined(min.heading)) {
                result.minimum.heading = min.heading;
                result.maximum.heading = max.heading;
            }
            if (defined(min.pitch)) {
                result.minimum.pitch = min.pitch;
                result.maximum.pitch = max.pitch;
            }
            if (defined(min.roll)) {
                result.minimum.roll = min.roll;
                result.maximum.roll = max.roll;
            }
            if (defined(min.longitude)) {
                result.minimum.longitude = min.longitude;
                result.maximum.longitude = max.longitude;
            }
            if (defined(min.latitude)) {
                result.minimum.latitude = min.latitude;
                result.maximum.latitude = max.latitude;
            }
            if (defined(min.height)) {
                result.minimum.height = min.height;
                result.maximum.height = max.height;
            }
        }

        return result;
    };

    return CameraLimiter;
});
