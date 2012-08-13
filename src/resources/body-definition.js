if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var BodyDefinition = function( options ) {
    options = options || {};

    var box2dBodyDef = new Box2D.b2BodyDef();
    box2dBodyDef._gladius = {};
    box2dBodyDef.set_bullet(options.hasOwnProperty( 'bullet' ) ?
      options.bullet : false);
    box2dBodyDef.set_type( options.hasOwnProperty( 'type' ) ?
      options.type : Box2D.b2_dynamicBody );
    box2dBodyDef.set_linearDamping( options.hasOwnProperty( 'linearDamping' ) ?
      options.linearDamping : 0 );
    box2dBodyDef.set_angularDamping( options.hasOwnProperty( 'angularDamping' ) ?
      options.angularDamping : 0 );
    box2dBodyDef.set_fixedRotation( options.hasOwnProperty( 'fixedRotation' ) ?
      options.fixedRotation : false );
    box2dBodyDef.set_angularVelocity( options.hasOwnProperty( 'angularVelocity' ) ?
      options.angularVelocity : 0 );
    box2dBodyDef.set_position( new Box2D.b2Vec2( 0, 0 ) );
    box2dBodyDef.set_active( false );
    box2dBodyDef.set_awake( false );
    return box2dBodyDef;
  };
  BodyDefinition.BodyTypes = {
    STATIC: Box2D.b2_staticBody,
    KINEMATIC: Box2D.b2_kinematicBody,
    DYNAMIC: Box2D.b2_dynamicBody
  };

  return BodyDefinition;
});