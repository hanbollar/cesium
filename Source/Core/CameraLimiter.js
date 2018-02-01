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
    CameraLimiter.prototype.closestLocationIn = function(position) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object(position, 'Cartesian3');
        //>>includeEnd('debug');

        if (defined(this.boundingObject)) {
            position = this.boundingObject.closestLocationIn(position);
        }
        return position;
    };

    /**
     * @private
     */
    CameraLimiter.prototype.closestOrientationTo = function(orientation, minCheck, maxCheck) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object(orientation, 'HeadingPitchRoll');
        //>>includeEnd('debug');

        if (minCheck) {
            orientation.heading = Math.max(this.minHeadingPitchRoll.heading, orientation.heading);
            orientation.pitch = Math.max(this.minHeadingPitchRoll.pitch, orientation.pitch);
            orientation.roll = Math.max(this.minHeadingPitchRoll.roll, orientation.roll);
        }
        if (maxCheck) {
            orientation.heading = Math.min(this.maxHeadingPitchRoll.heading, orientation.heading);
            orientation.pitch = Math.min(this.maxHeadingPitchRoll.pitch, orientation.pitch);
            orientation.roll = Math.min(this.maxHeadingPitchRoll.roll, orientation.roll);
        }
        return orientation;
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

        if (defined(limiter.minHeadingPitchRoll)) {
            // because of allLimiterValuesCreatedProperly - if min exists, max must too
            limiter.minHeadingPitchRoll.clone(result.minHeadingPitchRoll);
            limiter.maxHeadingPitchRoll.clone(result.maxHeadingPitchRoll);
        }

        return result;
    };

    return CameraLimiter;
});
