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

    if (options.direction){
      this._direction = math.vector2.normalize(options.direction);
    }else{
      this._direction = new math.Vector2();
    }

    if (options.magnitude){
      this._magnitude = options.magnitude;
    }else{
      this._magnitude = 0;
    }

    if (options.forceType){
      this._forceType = options.forceType;
    }else{
      this._forceType = 0;
    }

    Object.defineProperty(this, 'active', {
      get: function getActive() {
        return this._active ? true : false;
      },
      set: function setActive( val ) {
        this._active = val ? true : false;
      }
    });

    //We could optionally cache the total resulting force vector
    if (options.hasOwnProperty("active")){
      this.active = options.isActive;
    }else{
      this.active = true;
    }
  };
  Force.prototype = new Component();
  Force.prototype.constructor = Force;

  function getForce() {
    if (this.active){
      return math.vector2.multiply(this._direction, this._magnitude);
    }else{
      return new math.Vector2(0,0);
    }
  }

  function onUpdate( event ) {

  }

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

  var prototype = {
    getForce: getForce,
    onUpdate: onUpdate,
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