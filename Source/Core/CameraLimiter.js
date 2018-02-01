define([
    '../Core/Cartesian3',
    '../Core/Check',
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/HeadingPitchRoll',
    '../Core/Math',
    '../Core/Matrix3'
], function(
    Cartesian3,
    Check,
    defaultValue,
    defined,
    HeadingPitchRoll) {
    'use strict';

    /**
     * The CameraLimiter is used to limit a {@Camera}'s position (using a bounding object) and orientation (defined by {@HeadingPitchRange}.
     *
     * @alias CameraLimiter
     * @constructor
     *
     * @param {AxisAlignedBoundingBox|BoundingSphere|OrientedBoundingBox} [options.boundingObject] Assigned to the boundingObject attribute which can be used to specify limits on locations.
     * @param {HeadingPitchRoll} [options.minimumHeadingPitchRoll] Assigned to the minHeadingPitchRoll attribute which can be used to limit the minimum orientation.
     * @param {HeadingPitchRoll} [options.maximumHeadingPitchRoll] Assigned to the maxHeadingPitchRoll attribute which can be used to limit the maximum orientation.
     */
    function CameraLimiter(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        /**
         * The BoundingObject.
         * @type {AxisAlignedBoundingBox|BoundingSphere|OrientedBoundingBox}
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
    CameraLimiter.prototype.limitPosition = function(position, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object('position', position);
        Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        if (defined(this.boundingObject)) {
            this.boundingObject.projectedPoint(position, this.boundingObject, result);
        }
        return result;
    };

    /**
     * @private
     */
    CameraLimiter.prototype.limitOrientation = function(orientation, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object('orientation', orientation);
        Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        orientation.clone(result);
        if (defined(this.minHeadingPitchRoll)) {
            result.heading = Math.max(this.minHeadingPitchRoll.heading, result.heading);
            result.pitch = Math.max(this.minHeadingPitchRoll.pitch, result.pitch);
            result.roll = Math.max(this.minHeadingPitchRoll.roll, result.roll);
        }
        if (defined(this.maxHeadingPitchRoll)) {
            result.heading = Math.min(this.maxHeadingPitchRoll.heading, result.heading);
            result.pitch = Math.min(this.maxHeadingPitchRoll.pitch, result.pitch);
            result.roll = Math.min(this.maxHeadingPitchRoll.roll, result.roll);
        }
        return result;
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
        HeadingPitchRoll.clone(limiter.minHeadingPitchRoll, result.minHeadingPitchRoll);
        HeadingPitchRoll.clone(limiter.maxHeadingPitchRoll, result.maxHeadingPitchRoll);

        return result;
    };

    return CameraLimiter;
});
