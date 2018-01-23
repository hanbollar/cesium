 defineSuite([
        'Core/AxisAlignedBoundingBox',
        '/Core/BoundingRectangle',
        '/Core/BoundingSphere',
        '/Core/Cartesian2',
        '/Core/Cartesian3',
        '/Core/Cartesian4',
        '/Core/Cartographic',
        '/Core/defaultValue',
        '/Core/defined',
        '/Core/defineProperties',
        '/Core/DeveloperError',
        '/Core/EasingFunction',
        '/Core/Ellipsoid',
        '/Core/EllipsoidGeodesic',
        '/Core/Event',
        '/Core/HeadingPitchRange',
        '/Core/HeadingPitchRoll',
        '/Core/Intersect',
        '/Core/IntersectionTests',
        '/Core/Math',
        '/Core/Matrix3',
        '/Core/Matrix4',
        '/Core/OrientedBoundingBox'
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

    var limiter;

    beforeEach(function() {

    });

    // _allLimiterMaxMInPairsMatched -

         // coordinateLimits
        // minimum defined maximum defined
         // minimum defined maximum not
         // minimum not maximum defined
         // minimum not maximum not
         // longitude: minimum defined maximum defined
         // longitude: minimum defined maximum not
         // longitude: minimum not maximum defined
         // longitude: minimum not maximum not
         // latitude: minimum defined maximum defined
         // latitude: minimum defined maximum not
         // latitude: minimum not maximum defined
         // latitude: minimum not maximum not
         // height: minimum defined maximum defined
         // height: minimum defined maximum not
         // height: minimum not maximum defined
         // height: minimum not maximum not

         // headingPitchRollLimits
         // minimum defined maximum defined
         // minimum defined maximum not
         // minimum not maximum defined
         // minimum not maximum not
         // heading: minimum defined maximum defined
         // heading: minimum defined maximum not
         // heading: minimum not maximum defined
         // heading: minimum not maximum not
         // pitch: minimum defined maximum defined
         // pitch: minimum defined maximum not
         // pitch: minimum not maximum defined
         // pitch: minimum not maximum not
         // roll: minimum defined maximum defined
         // roll: minimum defined maximum not
         // roll: minimum not maximum defined
         // roll: minimum not maximum not

     // _positionAndElementsDefined -

        // position not defined
        // postion defined and x not defined
        // postion defined and y not defined
        // postion defined and z not defined
        // postion defined and all components defined

    // clone -

        // all items copy over properly if all are defined
        // all items copy over properly if not all items are defined

     // constructor -

        // creates empty with constraint containers defined but minimum and maximum inner vals are not

     // withinAllBoundingObjects -

        // throws if no bounding objects exist
        // if axisAligned is defined calls the withinAxisAligned with parameter positionToCheck
        // if boundingRectangle is defined calls withinBoundingRectangle with parameter positionToCheck
        // if boundingSphere is defined calls withinBoundingSphere with parameter positionToCheck
        // if orientedBoundingBox is defined calls withinOrientedBoundingBox with parameter positionToCheck
        // if

     // withinAtLeastOneBoundingObject -
     // withinAxisAligned -
     // withinBoundingRectangle -
     // withinBoundingSphere -
     // withinOrientedBoundingBox -
     // withinCoordinateLimits -
     // _withinLongitude -
     // _withinLatitude -
     // _withinHeight -
     // withinHeadingPitchRollLimits -
     // _withinHeading -
     // _withinPitch -
     // _witinRoll -

});
