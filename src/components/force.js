if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require("box2d");
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var math = require( "_math" );

  var Force = function(service, options){
    Component.call( this, "Force", service, []);
    options = options || {};
    var that = this;

    this.forceType = (undefined !== options.forceType ) ? options.forceType : Force.ForceTypes.GLOBAL;

    this.force = options.force || new math.Vector2();
  };
  Force.prototype = new Component();
  Force.prototype.constructor = Force;

  function onEntitySpaceChanged( event ) {
    var data = event.data;
    if( data.previous === null && data.current !== null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }

    if( data.previous !== null && data.current === null && this.owner !== null ) {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  function onComponentOwnerChanged( event ){
    var data = event.data;
    if( data.previous === null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
    }

    if( this.owner === null && data.previous !== null ) {
      this.provider.unregisterComponent( data.previous.id, this );
    }
  }

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      this.provider.registerComponent( this.owner.id, this );
    } else {
      this.provider.unregisterComponent( this.owner.id, this );
    }
  }

  function setForce( forceVector ) {
    this.force = forceVector;
  }

  var prototype = {
    setForce: setForce,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Force.prototype, prototype );

  Force.ForceTypes = {
    GLOBAL : 0
  };

  return Force;
});