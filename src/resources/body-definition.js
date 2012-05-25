//There is totally documentation for this that will be helpful
//Don't use alon zackai's version of box2d, use the one that is checked in
//Also look at old-src in the gladius develop branch

if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var BodyDefinition = function( options ) {
    options = options || {};

    this.box2dBodyDef = new Box2D.b2BodyDef();
    this.box2dBodyDef.set_type( options.hasOwnProperty( 'type' ) ?
      options.type : Box2D.b2_dynamicBody );
    this.box2dBodyDef.set_linearDamping( options.hasOwnProperty( 'linearDamping' ) ?
      options.linearDamping : 0 );
    this.box2dBodyDef.set_angularDamping( options.hasOwnProperty( 'angularDamping' ) ?
      options.angularDamping : 0 );
    this.box2dBodyDef.set_fixedRotation( options.hasOwnProperty( 'fixedRotation' ) ?
      options.fixedRotation : false );
    this.box2dBodyDef.set_angularVelocity( options.hasOwnProperty( 'angularVelocity' ) ?
      options.angularVelocity : 0 );
    this.box2dBodyDef.set_position( new Box2D.b2Vec2( 0, 0 ) );
    this.box2dBodyDef.set_active( false );
    this.box2dBodyDef.set_awake( false );
  };
  BodyDefinition.BodyTypes = {
    STATIC: Box2D.b2_staticBody,
    KINEMATIC: Box2D.b2_kinematicBody,
    DYNAMIC: Box2D.b2_dynamicBody
  };

  return BodyDefinition;
});