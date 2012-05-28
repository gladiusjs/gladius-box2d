if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var FixtureDefinition = function( options ) {
    options = options || {};
    if( !options.hasOwnProperty( 'shape') ) {
      throw 'missing shape';
    }
    this.box2dFixtureDef = new Box2D.b2FixtureDef();
    this.box2dFixtureDef.set_density( options.hasOwnProperty( 'density' ) ? options.density : 1 );
    this.box2dFixtureDef.set_shape( options.shape.box2dPolygonShape );
  };
  return FixtureDefinition;
});

