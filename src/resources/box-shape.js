
if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var BoxShape = function( hx, hy ) {
    hx = hx/2 || 0.5;
    hy = hy/2 || 0.5;
    var box2dPolygonShape = new Box2D.b2PolygonShape();
    box2dPolygonShape._gladius = {};
    box2dPolygonShape.SetAsBox( hx, hy );
    return box2dPolygonShape;
  };
  return BoxShape;
});