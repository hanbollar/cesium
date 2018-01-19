define([
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

        this.boundingObject = undefined;
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

    CameraLimiter.prototype.withinBoundingObject = function(positionToCheck) {

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
     * @private
     */
    CameraLimiter.clone = function(cameraLimiter, result) {
        if (!defined(result)) {
            result = new CameraLimiter();
        }

        Cartesian3.clone(camera.position, result.position);
        Cartesian3.clone(camera.direction, result.direction);
        Cartesian3.clone(camera.up, result.up);
        Cartesian3.clone(camera.right, result.right);
        Matrix4.clone(camera._transform, result.transform);
        result._transformChanged = true;

        return result;
    };

    /**
     * A function that will execute when a flight completes.
     * @callback Camera~FlightCompleteCallback
     */

    /**
     * A function that will execute when a flight is cancelled.
     * @callback Camera~FlightCancelledCallback
     */

    return Camera;
});
