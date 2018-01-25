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

     // CONSTRUCTOR -

     it('creates empty with constraint containers defined but minimum and maximum inner vals are not', function() {

     });

     // WITHIN BOUNDING OBJECT -

     it('within bounding object throws if no bounding objects are defined', function() {

     });

     it('within bounding object throws if position not defined', function() {

     });

     it('within bounding object throws if position defined and x not defined', function() {

     });

     it('within bounding object throws if position defined and y not defined', function() {

     });

     it('within bounding object throws if position defined and z not defined', function() {

     });

     it('within bounding object if bounding object is axisAligned instance calls the withinAxisAligned with parameter positionToCheck', function() {

     });

     it('within bounding object if bounding object is boundingRectangle instance calls withinBoundingRectangle with parameter positionToCheck', function() {

     });

     it('within bounding object if bounding object is boundingSphere instance calls withinBoundingSphere with parameter positionToCheck', function() {

     });

     it('within bounding object if bounding object is orientedBoundingBox instance calls withinOrientedBoundingBox with parameter positionToCheck', function() {

     });

     it('within bounding object if inputted Cartesian3 is within bounding object (axisAligned) returns true', function() {

     });

     it('within bounding object if inputted Cartesian3 is not within the bounding object (axisAligned) returns false', function() {

     });

     it('within bounding object if inputted Cartesian3 is within bounding object (boundingRectangle) returns true', function() {

     });

     it('within bounding object if inputted Cartesian3 is not within the bounding object (boundingRectangle) returns false', function() {

     });

     it('within bounding object if inputted Cartesian3 is within bounding object (boundingSphere) returns true', function() {

     });

     it('within bounding object if inputted Cartesian3 is not within the bounding object (boundingSphere) returns false', function() {

     });

     it('within bounding object if inputted Cartesian3 is within bounding object (orientedBoundingBox) returns true', function() {

     });

     it('within bounding object if inputted Cartesian3 is not within the bounding object (orientedBoundingBox) returns false', function() {

     });

     // WITHIN COORDINATE LIMITS -

     it('within coordinate limits throws if inputted value is not defined', function() {

     });

     it('within coordinate limits throws if inputted value is not of type Cartographic or Cartesian3', function() {

     });

     it('within coordinate limits if just longitude is defined, returns true if within longitude limits', function() {

     });

     it('within coordinate limits if just latitude is defined, returns true if within latitude limits', function() {

     });

     it('within coordinate limits if just height is defined, returns true if within height limits', function() {

     });

     it('within coordinate limits if longitude and latitude are defined, returns true if within longitude and latitude limits', function() {

     });

     it('within coordinate limits if longitude and latitude are defined, returns false if within longitude but not latitude', function() {

     });

     it('within coordinate limits if longitude and latitude are defined, returns false if not within longitude but within latitude', function() {

     });

     it('within coordinate limits if longitude and height are defined, returns true if within longitude and height', function() {

     });

     it('within coordinate limits if longitude and height are defined, returns false if within just longitude', function() {

     });

     it('within coordinate limits if longitude and height are defined, returns false if within just height', function() {

     });

     it('within coordinate limits if latitude and height are defined, returns true if within both', function() {

     });

     it('within coordinate limits if latitude and height are defined, returns false if within just latitude', function() {

     });

     it('within coordinate limits if latitude and height are defined, returns false if within just height', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns true if within all three', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just longitude and latitude', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just latitude and height', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just height and longitude', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just longitude', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just latitude', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just height', function() {

     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within none', function() {

     });

     // WITHIN HEADING PITCH ROLL LIMITS -

     it('within heading pitch roll limits throws if inputted value is not defined', function() {

     });

     it('within heading pitch roll limits throws if inputted value is not of type HeadingPitchRoll', function() {

     });

     it('within heading pitch roll limits if just heading is defined, returns true if within heading limits', function() {

     });

     it('within heading pitch roll limits if just pitch is defined, returns true if within pitch limits', function() {

     });

     it('within heading pitch roll limits if just roll is defined, returns true if within roll limits', function() {

     });

     it('within heading pitch roll limits if heading and pitch are defined, returns true if within heading and pitch limits', function() {

     });

     it('within heading pitch roll limits if heading and pitch are defined, returns false if within heading but not pitch', function() {

     });

     it('within heading pitch roll limits if heading and pitch are defined, returns false if not within heading but within pitch', function() {

     });

     it('within heading pitch roll limits if heading and roll are defined, returns true if within heading and roll', function() {

     });

     it('within heading pitch roll limits if heading and roll are defined, returns false if within just heading', function() {

     });

     it('within heading pitch roll limits if heading and roll are defined, returns false if within just roll', function() {

     });

     it('within heading pitch roll limits if pitch and roll are defined, returns true if within both', function() {

     });

     it('within heading pitch roll limits if pitch and roll are defined, returns false if within just pitch', function() {

     });

     it('within heading pitch roll limits if pitch and roll are defined, returns false if within just roll', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns true if within all three', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just heading and pitch', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just pitch and roll', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just roll and heading', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just heading', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just pitch', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just roll', function() {

     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within none', function() {

     });

     // ALL LIMITER MAX MIN PAIRS MATCHED -

         // coordinateLimits

     it('coordinateLimits check if minimum defined maximum defined', function() {

     });

     it('coordinateLimits check if minimum defined maximum not', function() {

     });

     it('coordinateLimits check if minimum not maximum defined', function() {

     });

     it('coordinateLimits check if minimum not maximum not', function() {

     });

     it('coordinateLimits check for longitude: minimum defined maximum defined', function() {

     });

     it('coordinateLimits check for longitude: minimum defined maximum not', function() {

     });

     it('coordinateLimits check for longitude: minimum not maximum defined', function() {

     });

     it('coordinateLimits check for longitude: minimum not maximum not', function() {

     });

     it('coordinateLimits check for latitude: minimum defined maximum defined', function() {

     });

     it('coordinateLimits check for latitude: minimum defined maximum not', function() {

     });

     it('coordinateLimits check for latitude: minimum not maximum defined', function() {

     });

     it('coordinateLimits check for latitude: minimum not maximum not', function() {

     });

     it('coordinateLimits check for height: minimum defined maximum defined', function() {

     });

     it('coordinateLimits check for height: minimum defined maximum not', function() {

     });

     it('coordinateLimits check for height: minimum not maximum defined', function() {

     });

     it('coordinateLimits check for height: minimum not maximum not', function() {

     });

         // headingPitchRollLimits


     it('headingPitchRollLimits check if minimum defined maximum defined', function() {

     });

     it('headingPitchRollLimits check if minimum defined maximum not', function() {

     });

     it('headingPitchRollLimits check if minimum not maximum defined', function() {

     });

     it('headingPitchRollLimits check if minimum not maximum not', function() {

     });

     it('headingPitchRollLimits check for heading: minimum defined maximum defined', function() {

     });

     it('headingPitchRollLimits check for heading: minimum defined maximum not', function() {

     });

     it('headingPitchRollLimits check for heading: minimum not maximum defined', function() {

     });

     it('headingPitchRollLimits check for heading: minimum not maximum not', function() {

     });

     it('headingPitchRollLimits check for pitch: minimum defined maximum defined', function() {

     });

     it('headingPitchRollLimits check for pitch: minimum defined maximum not', function() {

     });

     it('headingPitchRollLimits check for pitch: minimum not maximum defined', function() {

     });

     it('headingPitchRollLimits check for pitch: minimum not maximum not', function() {

     });

     it('headingPitchRollLimits check for roll: minimum defined maximum defined', function() {

     });

     it('headingPitchRollLimits check for roll: minimum defined maximum not', function() {

     });

     it('headingPitchRollLimits check for roll: minimum not maximum defined', function() {

     });
     t
     it('headingPitchRollLimits check for roll: minimum not maximum not', function() {

     });

     // CLONE -

     it('when cloning all items copy over properly if all are defined', function() {

     });

     it('when cloning all items copy over properly if not all items are defined', function() {

     });


});
