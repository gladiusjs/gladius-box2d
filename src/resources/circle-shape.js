
if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var CircleShape = function( radius ) {
    var box2dCircleShape = new Box2D.b2CircleShape();
    box2dCircleShape._gladius = {};
    box2dCircleShape.set_m_radius(radius);
    return box2dCircleShape;
  };
  return CircleShape;
});