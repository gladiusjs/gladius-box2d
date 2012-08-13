if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var FixtureDefinition = function( options ) {
    options = options || {};
    if( !options.hasOwnProperty( 'shape' ) ) {
      throw 'missing shape';
    }
    var box2dFixtureDef = new Box2D.b2FixtureDef();
    box2dFixtureDef._gladius = {};
    box2dFixtureDef.set_density( options.hasOwnProperty( 'density' ) ? options.density : 1 );
    box2dFixtureDef.set_friction( options.hasOwnProperty( 'friction' ) ? options.friction : 0.2);
    box2dFixtureDef.set_shape( options.shape );
    return box2dFixtureDef;
  };
  return FixtureDefinition;
});

