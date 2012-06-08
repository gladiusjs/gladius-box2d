if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function( require ) {

  return [
    "src/components/force.test",
    "src/resources/body-definition.test",
    "src/resources/box-shape.test",
    "src/resources/fixture-definition.test"
    ];

});
