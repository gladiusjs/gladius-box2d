
if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require( "box2d" );
  var BoxShape = function( hx, hy ) {
    hx = hx || 1;
    hy = hy || 1;
    this.box2dPolygonShape = new Box2D.b2PolygonShape();
    this.box2dPolygonShape.SetAsBox( hx, hy );
  };
  return BoxShape;
});