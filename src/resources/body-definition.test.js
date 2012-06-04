if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/resources/body-definition" ],
  function( BodyDefinition ) {
    return function() {

      module( "BodyDefinition", {
        setup: function() {},
        teardown: function() {}
      });

      test( "body definition exposes box2d enumerations", function() {
        expect( 3 );

        equal( BodyDefinition.BodyTypes.STATIC, 0, "static body type is correct" );
        equal( BodyDefinition.BodyTypes.KINEMATIC, 1, "kinematic body type is correct" );
        equal( BodyDefinition.BodyTypes.DYNAMIC, 2, "dynamic body type is correct" );
      });

      test( "create a new body definition, test default values", function() {
        expect( 9 );

        var bodyDefinition = new BodyDefinition();
        equal(bodyDefinition.get_type(), BodyDefinition.BodyTypes.DYNAMIC, "default body type is correct");
        deepEqual(bodyDefinition.get_linearDamping(), 0, "default linear damping is correct");
        deepEqual(bodyDefinition.get_angularDamping(), 0, "default angular damping is correct");
        equal(bodyDefinition.get_fixedRotation(), false, "default fixed rotation is correct");
        equal(bodyDefinition.get_angularVelocity(), 0, "default angular velocity is correct");
        equal(bodyDefinition.get_position().get_x(), 0, "default x position is correct");
        equal(bodyDefinition.get_position().get_y(), 0, "default y position is correct");
        equal(bodyDefinition.get_active(), false, "default active state is correct");
        equal(bodyDefinition.get_awake(), false, "default awake state is correct");
      });

      test( "create a new body definition, test assigned values", function() {
        expect( 5 );

        var data = {
          "type" : BodyDefinition.BodyTypes.KINEMATIC,
          "linearDamping" : 0.3,
          "angularDamping" : 0.2,
          "fixedRotation" : true,
          "angularVelocity" : 16
        };

        var bodyDefinition = new BodyDefinition(data);

        equal(bodyDefinition.get_type(), BodyDefinition.BodyTypes.KINEMATIC, "assigned body type is correct");
        ok(Math.abs(bodyDefinition.get_linearDamping() - 0.3) < 0.00001, "assigned linear damping is correct");
        ok(Math.abs(bodyDefinition.get_angularDamping() - 0.2) < 0.00001, "assigned angular damping is correct");
        equal(bodyDefinition.get_fixedRotation(), true, "assigned fixed rotation is correct");
        equal(bodyDefinition.get_angularVelocity(), 16, "assigned angular velocity is correct");
      });

    };
  }
);