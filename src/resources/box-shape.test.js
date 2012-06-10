if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  ["src/resources/box-shape"],
  function( BoxShape ) {
    return function() {

      module( "BoxShape", {
        setup: function() {},
        teardown: function() {}
      });

      test( 'default box shape is correct', function() {
        expect(0);
        var shape = new BoxShape();
        //TODO: find a way to test that x and y dimensions of shape are 1
      });

      test ( 'assigned box shape is correct', function() {
        expect(0);
        var shape = new BoxShape(2, 3);
        //TODO: find a way to test that x and y dimensions of shape are 2 and 3
      });

    };
  }
);