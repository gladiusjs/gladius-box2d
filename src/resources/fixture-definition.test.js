if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  [ "src/resources/fixture-definition",
    "src/resources/box-shape"],
  function( FixtureDefinition, BoxShape ) {
    return function() {

      module( "FixtureDefinition", {
        setup: function() {},
        teardown: function() {}
      });

      test( 'create a new fixture definition, test defaults', function() {
        expect(2);

        var box = new BoxShape( 1, 1 );

        var fixtureDef;
        try {
          fixtureDef = new FixtureDefinition();
        } catch (e) {
          ok(true, "Creating FixtureDefinition without params throws");
        }

        fixtureDef = new FixtureDefinition({
          shape: box
        });
        equal(fixtureDef.box2dFixtureDef.get_density(), 1, "default density is correct");

      });

      test( 'create a new fixture definition, test assigned values', function() {
        expect(2);

        var box = new BoxShape( 1, 1 );

        fixtureDef = new FixtureDefinition({
          shape: box,
          density: 20
        });
        equal(fixtureDef.box2dFixtureDef.get_shape(), box.box2dPolygonShape.ptr, "fixture has correct shape");
        equal(fixtureDef.box2dFixtureDef.get_density(), 20, "density is correct");

      });

    };
  }
);