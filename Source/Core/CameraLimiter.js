define([
    './AxisAlignedBoundingBox',
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
        this.minimum = {
            heading : undefined,
            pitch : undefined,
            roll : undefined,
            longitude : undefined,
            latitude : undefined,
            altitude : undefined
        };
        this.maximum = {
            heading : undefined,
            pitch : undefined,
            roll : undefined,
            longitude : undefined,
            latitude : undefined,
            altitude : undefined
        };
    }

    /**
     * Checks if the inputted Cartesian3|Cartogrpahic is within every bounding object used for this limiter.
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
        if (!(positionToCheck instanceof Cartesian3)) {
            throw new DeveloperError('positionToCheck required to be of type Cartesian3.');
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
     * TO FILL INT STILL - TODO------------------- NOT SURE IF REALLY NEED THIS - MAYBE JUST IN CAMERA HAVE THAT PART IN AN IF ELSE? - I KNOW I NEED THIS FOR POSITION BUT NOT SURE FOR ORIENTATION..... MAYBE.
     * GivenConstraints - returns closest valid location to inputted location
     */
    CameraLimiter.prototype.closestLocationTo = function(positionToCheck) {

        // withinCoordinateLimits wants cartographic
        // withinBounding wants cartesian

        // TODO -------- CHECK COMPLETED?????
        if (this.withinBoundingObject(positionToCheck) && this.withinCoordinateLimits(positionToCheck)) {
            return positionToCheck;
        }

        var cartographicValue;
        var cartesian3Value;
        if (positionToCheck instanceof Cartesian3) {
            cartesian3Value = positionToCheck;
            cartographicValue = Cartographic.fromCartesian(positionToCheck);
        } else if (positionToCheck instanceof Cartographic) {
            cartesian3Value = Cartesian3.fromRadians(positionToCheck.longitude, positionToCheck.latitude, positionToCheck.height);
            cartographicValue = positionToCheck;
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('position must be of Cartographic or Cartesian3 types.');
            //>>includeEnd('debug');
        }

        // both the below functions return cartographic values
        var closestToBounding = this._closestLocationToBoundingObject(cartesian3Value);
        var closestToCoordinates = this._closestLocationToCoordinatesLimits(cartographicValue);

        //>>includeStart('debug', pragmas.debug);
        if (!this.withinBoundingObject(closestToBounding)) {
            throw new DeveloperError('Camera was not originally within constraints when limiter was created.'
                                     + ' closestToBounding should be in the bounding object.');
        }
        if (!this.withinCoordinateLimits(closestToCoordinates)) {
            throw new DeveloperError('Camera was not originally within constraints when limiter was created. '
                                     + 'closestToCoordinates should be in the coordinate limits.');
        }
        //>>includeEnd('debug');

        var closestToBoundingInCoordinates = this.withinCoordinateLimits(closestToBounding);
        var closestToCoordinatesInBounding = this.withinBoundingObject(closestToCoordinates);

        if (closestToBoundingInCoordinates && closestToCoordinatesInBounding) {
            var c3ClosestToBounding = Cartesian3.fromRadians(closestToBounding.longitude, closestToBounding.latitude, closestToBounding.height);
            var c3ClosestToCoordinates = Cartesian3.fromRadians(closestToCoordinates.longitude, closestToCoordinates.latitude, closestToCoordinates.height);

            if (Cartesian3.distance(c3ClosestToBounding, cartesian3Value) < Cartesian3.distance(c3ClosestToCoordinates, cartesian3Value)) {
                return closestToBounding;
            }
            return closestToCartesian;
            return closestToCoordinates;
        } else if (closestToBoundingInCoordinates && !closestToCoordinatesInBounding) {
            return closestToBounding;
        } else if (!closestToBoundingInCoordinates && closestToCoordinatesInBounding) {
            return closestToCoordinates;
        }

        //>>includeStart('debug', pragmas.debug);
        throw new DeveloperError('(1) Disjointed Constraints: Coordinate Limits and Bounding Object must overlap somewhere.');
        //>>includeEnd('debug');
    };

    /**
     * @private
     */
    CameraLimiter.prototype._closestLocationToBoundingObject = function(position) {
        // already know the positionToCheck is defined and it's xyz vals are also defined
        // want input as cartesian3

// TODO ---------------------
        if (this.boundingObject instanceof AxisAlignedBoundingBox) {
            // axis aligned has center, min and max cartesian3 locations
        } else if (this.boundingObject instanceof BoundingRectangle) {

        } else if (this.boundingObject instanceof BoundingSphere) {

        } else if (this.boundingObject instanceof OrientedBoundingBox) {

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
    CameraLimiter.prototype._closestLocationToCoordinatesLimits = function(position) {
        // already know the positionToCheck is defined and it's xyz vals are also defined

        // want input as cartographic

        // convert to cartographic if needed
// TODO ---------------------check completed?

        var value;
        if (position instanceof Cartesian3) {
            value = Cartographic.fromCartesian(value);
        } else if (position instanceof Cartographic) {
            value = position;
        } else {
            //>>includeStart('debug', pragmas.debug);
            throw new DeveloperError('position must be of Cartographic or Cartesian3 types.');
            //>>includeEnd('debug');
        }

        this.allLimiterValuesCreatedProperly();

        // allLimiterValuesCreatedProperly means that if a min is defined, max must also be.
        var longitudeDefined = defined(this.minimum.longitude);
        var latitudeDefined = defined(this.minimum.latitude);
        var heightDefined = defined(this.minimum.height);

        if (longitudeDefined && !this._withinLongitude(value.longitude)) {
            if (value.longitude < this.minimum.longitude) {
                value.longitude = this.minimum.longitude;
            } else if (value.longitude > this.maximum.longitude) {
                value.longitude = this.maximum.longitude;
            }
        }
        if (latitudeDefined && !this._withinLatitude(value.latitude)) {
            if (value.latitude < this.minimum.latitude) {
                value.latitude = this.minimum.latitude;
            } else if (value.latitude > this.maximum.latitude) {
                value.latitude = this.maximum.latitude;
            }
        }
        if (heightDefined && !this._withinHeight(value.height)) {
            if (value.height < this.minimum.height) {
                value.height = this.minimum.height;
            } else if (value.height > this.maximum.height) {
                value.height = this.maximum.height;
            }
        }

        return value;
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

        var value;
        if (valueToCheck instanceof Cartographic) {
            value = valueToCheck;
        } else if (valueToCheck instanceof Cartesian3) {
            value = Cartographic.fromCartesian(valueToCheck);
        } else {
            throw new DeveloperError('valueToCheck must be only of type Cartesian3 or Cartographic');
        }

        this.allLimiterValuesCreatedProperly();

        var within = true;
        // due to allLimiterValuesCreatedProperly - if min exists, max must exist
        if (defined(this.minimum.longitude)) {
            within &= this._withinLongitude(value.longitude);
        }
        if (defined(this.minimum.latitude)) {
            within &= this._withinLatitude(value.latitude);
        }
        if (defined(this.minimum.height)) {
            within &= this._withinHeight(value.height);
        }

        return !!within; // so returned as a boolean instead of bitwise result
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

        return (longitudeToCheck >= this.minimum.longitude && longitudeToCheck <= this.maximum.longitude);
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

        return (latitudeToCheck >= this.minimum.latitude && latitudeToCheck <= this.maximum.latitude);
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

        return (heightToCheck >= this.minimum.height && heightToCheck <= this.maximum.height);
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
     * Checks if every maximum and minimum defined parameter values for coordinateLimits and for headingPitchRollLimits are defined
     * s.t. if a parameter is defined in the minimum it must be defined in the maximum and vice versa. The same should hold true for
     * the undefined case.
     *
     * @param {HeadingPitchRoll} [valueToCheck] Corresponds to the @link HeadingPitchRoll} being checked
     * @returns {Boolean} <code>true</code> if the {@link HeadingPitchRoll} is within the {@link HeadingPitchRoll} values defined for this limiter.
     */
    CameraLimiter.prototype.allLimiterValuesCreatedProperly = function() {
        return CameraLimiter._allLimiterValuesCreatedProperly(this);
    }

    /**
     * @private
     */
    CameraLimiter._allLimiterValuesCreatedProperly = function(limiter) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(limiter)) {
            throw new DeveloperError('limiter is required.');
        }

        if (!defined(limiter.minimum) && defined(limiter.maximum)) {
            throw new DeveloperError('minimum is required.');
        }
        if (!defined(limiter.maximum) && defined(limiter.minimum)) {
            throw new DeveloperError('maximum is required.');
        }
        if (!defined(limiter.minimum) && !defined(limiter.maximum)) {
            throw new DeveloperError('minimum and maximum required');
        }

        // minimum and maximum must be defined
        if (!defined(limiter.minimum.longitude) && defined(limiter.maximum.longitude)) {
            throw new DeveloperError('minimum.longitude is required.');
        }
        if (!defined(limiter.minimum.latitude) && defined(limiter.maximum.latitude)) {
            throw new DeveloperError('minimum.latitude is required.');
        }
        if (!defined(limiter.minimum.height) && defined(limiter.maximum.height)) {
            throw new DeveloperError('minimum.height is required.');
        }
        if (!defined(limiter.maximum.longitude) && defined(limiter.minimum.longitude)) {
            throw new DeveloperError('maximum.longitude is required.');
        }
        if (!defined(limiter.maximum.latitude) && defined(limiter.minimum.latitude)) {
            throw new DeveloperError('maximum.latitude is required.');
        }
        if (!defined(limiter.maximum.height) && defined(limiter.minimum.height)) {
            throw new DeveloperError('maximum.height is required.');
        }
        if (!defined(limiter.minimum.heading) && defined(limiter.maximum.heading)) {
            throw new DeveloperError('minimum.heading is required.');
        }
        if (!defined(limiter.minimum.pitch) && defined(limiter.maximum.pitch)) {
            throw new DeveloperError('minimum.pitch is required.');
        }
        if (!defined(limiter.minimum.roll) && defined(limiter.maximum.roll)) {
            throw new DeveloperError('minimum.roll is required.');
        }
        if (!defined(limiter.maximum.heading) && defined(limiter.minimum.heading)) {
            throw new DeveloperError('maximum.heading is required.');
        }
        if (!defined(limiter.maximum.pitch) && defined(limiter.minimum.pitch)) {
            throw new DeveloperError('maximum.pitch is required.');
        }
        if (!defined(limiter.maximum.roll) && defined(limiter.minimum.roll)) {
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
