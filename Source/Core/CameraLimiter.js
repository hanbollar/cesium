define([
    '../Core/Cartesian3',
    '../Core/Check',
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/HeadingPitchRoll',
    '../Core/Matrix4',
    '../Core/Quaternion',
    '../Core/Transforms'
], function(
    Cartesian3,
    Check,
    defaultValue,
    defined,
    HeadingPitchRoll,
    Matrix4,
    Quaternion,
    Transforms) {
    'use strict';

    /**
     * The CameraLimiter is used to limit a {@link Camera}'s position (using a bounding object) and orientation (defined by min and max values of {@link HeadingPitchRoll}).
     *
     * If set, the camera of this limiter will be constrained by location and viewing ability for moving and changes in the look vector.
     * The camera ignores position and orientation limits in {@link SceneMode#SCENE2D} view and {@link SceneMode#COLUMBUS_VIEW}.
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
         * The BoundingObject. Used to restrict camera positions of the {@link Camera} holding this CameraLimiter.
         * @type {AxisAlignedBoundingBox|BoundingSphere|OrientedBoundingBox}
         * @default undefined
         */
        this.boundingObject = options.boundingObject;

        /**
         * The minimum orientation values.
         * @type {HeadingPitchRoll}
         */
        this.minHeadingPitchRoll = HeadingPitchRoll.clone(options.minimumHeadingPitchRoll);

        /**
         * The maximum orientation values.
         * @type {HeadingPitchRoll}
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
            result = this.boundingObject.projectedPoint(position, result);
        }
        return result;
    };

    var scratchMatrix4 = new Matrix4();
    /**
     * @private
     */
    CameraLimiter.prototype.limitOrientation = function(orientation, position, result) {
        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.object('orientation', orientation);
        Check.typeOf.object('result', result);
        //>>includeEnd('debug');

        if (!defined(this.minHeadingPitchRoll) && !defined(this.maxHeadingPitchRoll)) {
            result = orientation;
            return result;
        }

        var quat = Quaternion.fromHeadingPitchRoll(orientation);
        var transform = Transforms.headingPitchRollToFixedFrame(position, orientation);
        var quatResult = Quaternion.fromRotationMatrix(Matrix4.getRotation(transform, scratchMatrix4));
        Quaternion.multiply(quatResult, quat, quatResult);
        result = HeadingPitchRoll.fromQuaternion(quatResult);

        var minHPR = this.minHeadingPitchRoll;
        var maxHPR = this.maxHeadingPitchRoll;

        if (defined(this.minHeadingPitchRoll)) {
            result.heading = Math.max(minHPR.heading, orientation.heading);
            result.pitch = Math.max(minHPR.pitch, orientation.pitch);
            result.roll = Math.max(minHPR.roll, orientation.roll);
        }
        if (defined(this.maxHeadingPitchRoll)) {
            result.heading = Math.min(maxHPR.heading, orientation.heading);
            result.pitch = Math.min(maxHPR.pitch, orientation.pitch);
            result.roll = Math.min(maxHPR.roll, orientation.roll);
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
        if (!defined(limiter)) {
            return result;
        }
        if (defined(limiter.boundingObject)) {
            result.boundingObject = limiter.boundingObject.clone(result.boundingObject);
        }
        result.minHeadingPitchRoll = HeadingPitchRoll.clone(limiter.minHeadingPitchRoll, result.minHeadingPitchRoll);
        result.maxHeadingPitchRoll = HeadingPitchRoll.clone(limiter.maxHeadingPitchRoll, result.maxHeadingPitchRoll);

        return result;
    };

    return CameraLimiter;
});
