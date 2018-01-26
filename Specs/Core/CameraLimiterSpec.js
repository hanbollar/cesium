 defineSuite([
        'Scene/CameraLimiter',
        'Core/AxisAlignedBoundingBox',
        'Core/BoundingRectangle',
        'Core/BoundingSphere',
        'Core/Cartesian2',
        'Core/Cartesian3',
        'Core/Cartesian4',
        'Core/Cartographic',
        'Core/defaultValue',
        'Core/defined',
        'Core/defineProperties',
        'Core/DeveloperError',
        'Core/EasingFunction',
        'Core/Ellipsoid',
        'Core/EllipsoidGeodesic',
        'Core/Event',
        'Core/HeadingPitchRange',
        'Core/HeadingPitchRoll',
        'Core/Intersect',
        'Core/IntersectionTests',
        'Core/Math',
        'Core/Matrix3',
        'Core/Matrix4',
        'Core/OrientedBoundingBox'
    ], function(
        CameraLimiter,
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

    var limiter;


    beforeEach(function() {
        limiter = new CameraLimiter();
    });

     // CONSTRUCTOR -

     // // WITHIN BOUNDING OBJECT -


     // WITHIN HEADING PITCH ROLL LIMITS -

     it('when cloning all items copy over properly if all are defined', function() {

     });

});
