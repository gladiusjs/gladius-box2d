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
    box2dFixtureDef.set_restitution( options.hasOwnProperty( 'restitution' ) ? options.restitution : 0);
    if (options.hasOwnProperty( 'filter' )){
      var filter = box2dFixtureDef.get_filter();
      if (options.filter.hasOwnProperty( 'groupIndex' )){
        filter.set_groupIndex(options.filter.groupIndex);
      }
      if (options.filter.hasOwnProperty( 'categoryBits' )){
        filter.set_categoryBits(options.filter.categoryBits);
      }
      if (options.filter.hasOwnProperty( 'maskBits' )){
        filter.set_maskBits(options.filter.maskBits);
      }
    }
    box2dFixtureDef.set_shape( options.shape );
    return box2dFixtureDef;
  };
  return FixtureDefinition;
});

