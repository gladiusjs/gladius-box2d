/**
 * Created with JetBrains WebStorm.
 * User: dperit
 * Date: 12-08-10
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */
if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  ["src/resources/circle-shape"],
  function( CircleShape ) {
    return function() {

      module( "CircleShape", {
        setup: function() {},
        teardown: function() {}
      });

      test( 'default circle shape is correct', function() {
        expect(0);
        var shape = new CircleShape();
      });

      test ( 'assigned circle shape is correct', function() {
        expect(0);
        var shape = new CircleShape(2);
      });

    };
  }
);