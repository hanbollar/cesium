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

     it('creates empty with constraint containers defined but minimum and maximum inner vals are not', function() {
        expect(limiter.boundingObject).not.toBeDefined();
        expect(limiter.minimum).toBeDefined();
        expect(limiter.maximum).toBeDefined();
        expect(limiter.minimum.heading).not.toBeDefined();
        expect(limiter.minimum.pitch).not.toBeDefined();
        expect(limiter.minimum.roll).not.toBeDefined();
        expect(limiter.minimum.longitude).not.toBeDefined();
        expect(limiter.minimum.latitude).not.toBeDefined();
        expect(limiter.minimum.height).not.toBeDefined();
        expect(limiter.maximum.heading).not.toBeDefined();
        expect(limiter.maximum.pitch).not.toBeDefined();
        expect(limiter.maximum.roll).not.toBeDefined();
        expect(limiter.maximum.longitude).not.toBeDefined();
        expect(limiter.maximum.latitude).not.toBeDefined();
        expect(limiter.maximum.height).not.toBeDefined();
     });

     // // WITHIN BOUNDING OBJECT -
     //
     // it('within bounding object throws if no bounding objects are defined', function() {
     //
     // });
     //
     // it('within bounding object throws if position not defined', function() {
     //
     // });
     //
     // it('within bounding object throws if position defined and x not defined', function() {
     //
     // });
     //
     // it('within bounding object throws if position defined and y not defined', function() {
     //
     // });
     //
     // it('within bounding object throws if position defined and z not defined', function() {
     //
     // });
     //
     // it('within bounding object if bounding object is axisAligned instance calls the withinAxisAligned with parameter positionToCheck', function() {
     //
     // });
     //
     // it('within bounding object if bounding object is boundingRectangle instance calls withinBoundingRectangle with parameter positionToCheck', function() {
     //
     // });
     //
     // it('within bounding object if bounding object is boundingSphere instance calls withinBoundingSphere with parameter positionToCheck', function() {
     //
     // });
     //
     // it('within bounding object if bounding object is orientedBoundingBox instance calls withinOrientedBoundingBox with parameter positionToCheck', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is within bounding object (axisAligned) returns true', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is not within the bounding object (axisAligned) returns false', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is within bounding object (boundingRectangle) returns true', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is not within the bounding object (boundingRectangle) returns false', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is within bounding object (boundingSphere) returns true', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is not within the bounding object (boundingSphere) returns false', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is within bounding object (orientedBoundingBox) returns true', function() {
     //
     // });
     //
     // it('within bounding object if inputted Cartesian3 is not within the bounding object (orientedBoundingBox) returns false', function() {
     //
     // });
     //
     // WITHIN COORDINATE LIMITS -

     it('within coordinate limits throws if inputted value is not defined', function() {
         var locToCheck;
         expect(function() {
             return limiter.withinCoordinateLimits(locToCheck);
         }).toThrowDeveloperError();
     });

     it('within coordinate limits throws if inputted value is not of type Cartographic or Cartesian3', function() {
         var locToCheck = 1;
         expect(function() {
             return limiter.withinCoordinateLimits(locToCheck);
         }).toThrowDeveloperError();
     });

     it('within coordinate limits if just longitude is defined, returns true if within longitude limits', function() {
         var locToCheck = new Cartographic(1, 0, 0);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if just longitude is defined, returns false if not within longitude limits', function() {
         var locToCheck = new Cartographic(11, 0, 0);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if just latitude is defined, returns true if within latitude limits', function() {
         var locToCheck = new Cartographic(0, 1, 0);
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if just latitude is defined, returns false if not within latitude limits', function() {
         var locToCheck = new Cartographic(0, 11, 0);
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if just height is defined, returns true if within height limits', function() {
         var locToCheck = new Cartographic(0, 0, 1);
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if just height is defined, returns false if not within height limits', function() {
         var locToCheck = new Cartographic(0, 0, 11);
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude and latitude are defined, returns true if within longitude and latitude limits', function() {
         var locToCheck = new Cartographic(1, 1, 0);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if longitude and latitude are defined, returns false if within longitude but not latitude', function() {
         var locToCheck = new Cartographic(1, 11, 0);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude and latitude are defined, returns false if not within longitude but within latitude', function() {
         var locToCheck = new Cartographic(11, 1, 0);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude and height are defined, returns true if within longitude and height', function() {
         var locToCheck = new Cartographic(1, 0, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if longitude and height are defined, returns false if within just longitude', function() {
         var locToCheck = new Cartographic(1, 0, 11);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude and height are defined, returns false if within just height', function() {
         var locToCheck = new Cartographic(11, 0, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if latitude and height are defined, returns true if within both', function() {
         var locToCheck = new Cartographic(0, 1, 1);
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if latitude and height are defined, returns false if within just latitude', function() {
         var locToCheck = new Cartographic(0, 1, 11);
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if latitude and height are defined, returns false if within just height', function() {
         var locToCheck = new Cartographic(0, 11, 1);
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns true if within all three', function() {
         var locToCheck = new Cartographic(1, 1, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(true);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just longitude and latitude', function() {
         var locToCheck = new Cartographic(1, 1, 11);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just latitude and height', function() {
         var locToCheck = new Cartographic(11, 1, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just height and longitude', function() {
         var locToCheck = new Cartographic(1, 11, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just longitude', function() {
         var locToCheck = new Cartographic(1, 11, 11);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just latitude', function() {
         var locToCheck = new Cartographic(11, 1, 11);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within just height', function() {
         var locToCheck = new Cartographic(11, 11, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     it('within coordinate limits if longitude latitude and height are defined, returns false if within none', function() {
         var locToCheck = new Cartographic(11, 11, 1);
         limiter.minimum.longitude = -1;
         limiter.maximum.longitude = 2;
         limiter.minimum.latitude = -1;
         limiter.maximum.latitude = 2;
         limiter.minimum.height = -1;
         limiter.maximum.height = 2;
         expect(limiter.withinCoordinateLimits(locToCheck)).toBe(false);
     });

     // WITHIN HEADING PITCH ROLL LIMITS -

     it('within heading pitch roll limits throws if inputted value is not defined', function() {
         var locToCheck;
         expect(function() {
             return limiter.withinHeadingPitchRollLimits(locToCheck);
         }).toThrowDeveloperError();
     });

     it('within heading pitch roll limits throws if inputted value is not of type HeadingPitchRoll', function() {
         var locToCheck = 1;
         expect(function() {
             return limiter.withinHeadingPitchRollLimits(locToCheck);
         }).toThrowDeveloperError();
     });

     it('within heading pitch roll limits if just heading is defined, returns true if within heading limits', function() {
         var locToCheck = new HeadingPitchRoll(1, 0, 0);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if just heading is defined, returns false if not within heading limits', function() {
         var locToCheck = new HeadingPitchRoll(11, 0, 0);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if just pitch is defined, returns true if within pitch limits', function() {
         var locToCheck = new HeadingPitchRoll(0, 1, 0);
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if just pitch is defined, returns false if not within pitch limits', function() {
         var locToCheck = new HeadingPitchRoll(0, 11, 0);
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     })

     it('within heading pitch roll limits if just roll is defined, returns true if within roll limits', function() {
         var locToCheck = new HeadingPitchRoll(0, 0, 1);
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if just roll is defined, returns false if not within roll limits', function() {
         var locToCheck = new HeadingPitchRoll(0, 0, 11);
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading and pitch are defined, returns true if within heading and pitch limits', function() {
         var locToCheck = new HeadingPitchRoll(1, 1, 0);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if heading and pitch are defined, returns false if within heading but not pitch', function() {
         var locToCheck = new HeadingPitchRoll(1, 11, 0);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading and pitch are defined, returns false if not within heading but within pitch', function() {
         var locToCheck = new HeadingPitchRoll(11, 1, 0);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading and roll are defined, returns true if within heading and roll', function() {
         var locToCheck = new HeadingPitchRoll(1, 0, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if heading and roll are defined, returns false if within just heading', function() {
         var locToCheck = new HeadingPitchRoll(11, 0, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if pitch and roll are defined, returns false if within just roll', function() {
         var locToCheck = new HeadingPitchRoll(0, 11, 1);
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading and roll are defined, returns false if within just roll', function() {
         var locToCheck = new HeadingPitchRoll(11, 0, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if pitch and roll are defined, returns true if within both', function() {
         var locToCheck = new HeadingPitchRoll(0, 1, 1);
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if pitch and roll are defined, returns false if within just pitch', function() {
         var locToCheck = new HeadingPitchRoll(0, 1, 11);
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if pitch and roll are defined, returns false if within just roll', function() {
         var locToCheck = new HeadingPitchRoll(0, 11, 1);
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns true if within all three', function() {
         var locToCheck = new HeadingPitchRoll(1, 1, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(true);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just heading and pitch', function() {
         var locToCheck = new HeadingPitchRoll(1, 1, 11);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just pitch and roll', function() {
         var locToCheck = new HeadingPitchRoll(11, 1, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just roll and heading', function() {
         var locToCheck = new HeadingPitchRoll(1, 11, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just heading', function() {
         var locToCheck = new HeadingPitchRoll(1, 11, 11);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just pitch', function() {
         var locToCheck = new HeadingPitchRoll(11, 1, 11);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within just roll', function() {
         var locToCheck = new HeadingPitchRoll(11, 11, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('within heading pitch roll limits if heading pitch and roll are defined, returns false if within none', function() {
         var locToCheck = new HeadingPitchRoll(11, 11, 1);
         limiter.minimum.heading = -1;
         limiter.maximum.heading = 2;
         limiter.minimum.pitch = -1;
         limiter.maximum.pitch = 2;
         limiter.minimum.roll = -1;
         limiter.maximum.roll = 2;
         expect(limiter.withinHeadingPitchRollLimits(locToCheck)).toBe(false);
     });

     it('all limiter values created properly checks original creation nothing is defined', function() {
         expect(limiter.boundingObject).not.toBeDefined();
         expect(limiter.minimum.heading).not.toBeDefined();
         expect(limiter.minimum.pitch).not.toBeDefined();;
         expect(limiter.minimum.roll).not.toBeDefined();
         expect(limiter.minimum.longitude).not.toBeDefined();
         expect(limiter.minimum.latitude).not.toBeDefined();
         expect(limiter.minimum.height).not.toBeDefined();
         expect(limiter.maximum.heading).not.toBeDefined();
         expect(limiter.maximum.pitch).not.toBeDefined();;
         expect(limiter.maximum.roll).not.toBeDefined();
         expect(limiter.maximum.longitude).not.toBeDefined();
         expect(limiter.maximum.latitude).not.toBeDefined();
         expect(limiter.maximum.height).not.toBeDefined();
     });

     it('all limiter values created properly checks when both minimum and maximum are not defined', function() {
         limiter.minimum = undefined;
         limiter.maximum = undefined;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly checks if minimum defined maximum not', function() {
        limiter.maximum = undefined;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly checks if minimum not defined and maximum defined', function() {
         limiter.minimum = undefined;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly checks when both minimum and maximum are defined', function() {
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).not.toThrowDeveloperError();
     });

     it('all limiter values created properly coordinateLimits check for minimum maximum defined: longitude', function() {
         limiter.minimum.longitude = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.longitude = undefined;
         limiter.maximum.longitude = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly coordinateLimits check for minimum maximum defined: latitude', function() {
         limiter.minimum.latitude = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.latitude = undefined;
         limiter.maximum.latitude = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly coordinateLimits check for minimum maximum defined: height', function() {
         limiter.minimum.height = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.height = undefined;
         limiter.maximum.height = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly headingPitchRollLimits check for minimum maximum defined: heading', function() {
         limiter.minimum.heading = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.heading = undefined;
         limiter.maximum.heading = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly headingPitchRollLimits check for minimum maximum defined: pitch', function() {
         limiter.minimum.pitch = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.pitch = undefined;
         limiter.maximum.pitch = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('all limiter values created properly headingPitchRollLimits check for minimum maximum defined: roll', function() {
         limiter.minimum.roll = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
         limiter.minimum.roll = undefined;
         limiter.maximum.roll = 1;
         expect(function() {
             return limiter.allLimiterValuesCreatedProperly();
         }).toThrowDeveloperError();
     });

     it('when cloning all items copy over properly if all are defined', function() {
        var result;
        limiter.minimum.heading = 1;
        limiter.minimum.pitch = 1;
        limiter.minimum.roll = 1;
        limiter.minimum.longitude = 1;
        limiter.minimum.latitude = 1;
        limiter.minimum.height = 1;
        limiter.maximum.heading = 1;
        limiter.maximum.pitch = 1;
        limiter.maximum.roll = 1;
        limiter.maximum.longitude = 1;
        limiter.maximum.latitude = 1;
        limiter.maximum.height = 1;
        limiter.boundingObject = new BoundingRectangle(1, 1, 1, 1);
        result = limiter.clone(result);

        expect(result.minimum.heading).toEqual(limiter.minimum.heading);
        expect(result.minimum.pitch).toEqual(limiter.minimum.pitch);
        expect(result.minimum.roll).toEqual(limiter.minimum.roll);
        expect(result.minimum.longitude).toEqual(limiter.minimum.longitude);
        expect(result.minimum.latitude).toEqual(limiter.minimum.latitude);
        expect(result.minimum.height).toEqual(limiter.minimum.height);
        expect(result.boundingObject).toBeDefined();
        expect(result.boundingObject instanceof BoundingRectangle).toBe(true);
     });

});
