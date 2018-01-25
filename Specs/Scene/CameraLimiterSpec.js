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

     // constructor -

        // creates empty with constraint containers defined but minimum and maximum inner vals are not

     // withinBoundingObject -

        // throws if no bounding objects are defined
        // throws if position not defined
        // throws if position defined and x not defined
        // throws if position defined and y not defined
        // throws if position defined and z not defined
        // throws if position defined and all components defined
        // if bounding object is axisAligned instance calls the withinAxisAligned with parameter positionToCheck
        // if bounding object is boundingRectangle instance calls withinBoundingRectangle with parameter positionToCheck
        // if bounding object is boundingSphere instance calls withinBoundingSphere with parameter positionToCheck
        // if bounding object is orientedBoundingBox instance calls withinOrientedBoundingBox with parameter positionToCheck
        // if inputted Cartesian3 is within bounding object (axisAligned) returns true
        // if inputted Cartesian3 is not within the bounding object (axisAligned) returns false
        // if inputted Cartesian3 is within bounding object (boundingRectangle) returns true
        // if inputted Cartesian3 is not within the bounding object (boundingRectangle) returns false
        // if inputted Cartesian3 is within bounding object (boundingSphere) returns true
        // if inputted Cartesian3 is not within the bounding object (boundingSphere) returns false
        // if inputted Cartesian3 is within bounding object (orientedBoundingBox) returns true
        // if inputted Cartesian3 is not within the bounding object (orientedBoundingBox) returns false

     // withinCoordinateLimits -

        // throws if inputted value is not defined
        // throws if inputted value is not of type Cartographic or Cartesian3
        // if just longitude is defined, returns true if within longitude limits
        // if just latitude is defined, returns true if within latitude limits
        // if just height is defined, returns true if within height limits
        // if longitude and latitude are defined, returns true if within longitude and latitude limits
        // if longitude and latitude are defined, returns false if within longitude but not latitude
        // if longitude and latitude are defined, returns false if not within longitude but within latitude
        // if longitude and height are defined, returns true if within longitude and height
        // if longitude and height are defined, returns false if within just longitude
        // if longitude and height are defined, returns false if within just height
        // if latitude and height are defined, returns true if within both
        // if latitude and height are defined, returns false if within just latitude
        // if latitude and height are defined, returns false if within just height
        // if longitude latitude and height are defined, returns true if within all three
        // if longitude latitude and height are defined, returns false if within just longitude and latitude
        // if longitude latitude and height are defined, returns false if within just latitude and height
        // if longitude latitude and height are defined, returns false if within just height and longitude
        // if longitude latitude and height are defined, returns false if within just longitude
        // if longitude latitude and height are defined, returns false if within just latitude
        // if longitude latitude and height are defined, returns false if within just height
        // if longitude latitude and height are defined, returns false if within none

     // withinHeadingPitchRollLimits -

        // throws if inputted value is not defined
        // throws if inputted value is not of type HeadingPitchRoll
        // if just heading is defined, returns true if within heading limits
        // if just pitch is defined, returns true if within pitchroll limits
        // if just roll is defined, returns true if within roll limits
        // if heading and pitch are defined, returns true if within heading and pitch limits
        // if heading and pitch are defined, returns false if within heading but not pitch
        // if heading and pitch are defined, returns false if not within heading but within pitch
        // if heading and roll are defined, returns true if within heading and roll
        // if heading and roll are defined, returns false if within just heading
        // if heading and roll are defined, returns false if within just roll
        // if pitch and roll are defined, returns true if within both
        // if pitch and roll are defined, returns false if within just pitch
        // if pitch and roll are defined, returns false if within just rollroll
        // if heading pitch and roll are defined, returns true if within all three
        // if heading pitch and roll are defined, returns false if within just heading and pitch
        // if heading pitch and roll are defined, returns false if within just pitch and roll
        // if heading pitch and roll are defined, returns false if within just roll and heading
        // if heading pitch and roll are defined, returns false if within just heading
        // if heading pitch and roll are defined, returns false if within just pitch
        // if heading pitch and roll are defined, returns false if within just roll
        // if heading pitch and roll are defined, returns false if within none

     // allLimiterMaxMInPairsMatched -

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

     // clone -

         // all items copy over properly if all are defined
         // all items copy over properly if not all items are defined


});
