if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  ["src/components/body",
   "src/resources/fixture-definition",
   "src/resources/box-shape",
   "src/resources/body-definition"],
  function( Body, FixtureDefinition, BoxShape, BodyDefinition ) {
    return function() {

      module( "Body", {
        setup: function() {},
        teardown: function() {}
      });

      test( 'supplied definitions get applied to the body properly', function() {
        expect(2);
        var shape = new BoxShape();
        var fixtureDefinition = new FixtureDefinition({shape: shape});
        var bodyDefinition = new BodyDefinition();
        var body = new Body({
          fixtureDefinition: fixtureDefinition,
          bodyDefinition: bodyDefinition});
        //uh...
      });

    };
  }
);