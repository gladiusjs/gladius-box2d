if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define(
  ["src/components/force",
   "_math"],
  function( Force, math) {
    return function() {

      module( "Force", {
        setup: function() {
          this.service = {};
        },
        teardown: function() {}
      });

      test( 'force created properly with 0 arguments', function() {
        expect(2);
        var force = new Force();
        deepEqual(force.force, new math.Vector2(), "default force vector is default math.vector2");
        equal(force.forceType, Force.ForceTypes.GLOBAL, "default force type is global")
      });

      test( 'force created properly with 2 arguments', function(){
        expect(2);
        var forceVector = new math.Vector2([5,-2]);
        var force = new Force(this.service, {force: forceVector, forceType:5});
        equal(force.force, forceVector, "force vector assigned properly");
        equal(force.forceType, 5, "force type assigned properly");
      });

    };
  }
);