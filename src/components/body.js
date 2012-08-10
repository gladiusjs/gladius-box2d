if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require("box2d");
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var math = require( "_math" );

  var Body = function(service, options){
    Component.call( this, "Body", service, ["Transform"] );
    options = options || {};
    var that = this;
    var i;

    this.service = service;

    if( options.bodyDefinition) {
      this.box2dBody = service.world.CreateBody( options.bodyDefinition );
    } else {
      throw new Error( "missing body definition" );
    }

    if( options.fixtureDefinition ) {
      this.box2dBody.CreateFixture( options.fixtureDefinition );
    }
    this.box2dBody.component = this;  // TD: this might be a bad idea because we're assigning a javascript
                                      //     property to something that is basically c++ code
    this.box2dBody.SetLinearVelocity( new Box2D.b2Vec2( 0, 0 ) );

    Object.defineProperty(this, 'active', {
      get: function getActive() {
        return this.box2dBody.IsActive() ? true : false;
      },
      set: function setActive( val ) {
        return this.box2dBody.SetActive( val ) ? true : false;
      }
    });
  };
  Body.prototype = new Component();
  Body.prototype.constructor = Body;

  var linearImpulse = new Box2D.b2Vec2( 0, 0 );
  function onLinearImpulse( event ) {
    var impulse = event.data.impulse;
    linearImpulse.Set( impulse[0], impulse[1] );
    this.box2dBody.ApplyLinearImpulse( linearImpulse, this.box2dBody.GetPosition() );
    linearImpulse.Set( 0, 0 );
  }

  function onAngularImpulse( event ) {
    this.box2dBody.ApplyAngularImpulse( event.data.impulse );
  }

  function onUpdate( event ) {
    var position2 = this.box2dBody.GetPosition();
    var angle2 = this.box2dBody.GetAngle();

    // TD: This will cause the transform to emit an event that we handle below. Blech!
    var transform = this.owner.findComponent( "Transform" );
    //Note: It is currently okay to read from buffers, but writing to them will result in things breaking
    if (this.service.dimensionMap === this.service.DimensionMaps.XY){
      transform.position = [ position2.get_x(), position2.get_y(), transform.position.buffer[2] ];
      transform.rotation.z = angle2;
    }else if (this.service.dimensionMap === this.service.DimensionMaps.XZ){
      transform.position = [ position2.get_x(), transform.position.buffer[1], position2.get_y()];
      transform.rotation.y = angle2;
    }else{
      transform.position = [transform.position.buffer[0], position2.get_y(), position2.get_x()];
      transform.rotation.x = angle2;
    }
  }

  function onEntitySpaceChanged( event ) {
    var data = event.data;
    if( data.previous === null && data.current !== null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
      this.box2dBody.SetActive( true );
      this.box2dBody.SetAwake( true );
    }

    if( data.previous !== null && data.current === null && this.owner !== null ) {
      this.provider.unregisterComponent( this.owner.id, this );
      this.box2dBody.SetActive( false );
      this.box2dBody.SetAwake( false );
    }
  }

  function onComponentOwnerChanged( event ){
    var data = event.data;
    if( data.previous === null && this.owner !== null ) {
      this.provider.registerComponent( this.owner.id, this );
      this.box2dBody.SetActive( true );
      this.box2dBody.SetAwake( true );
    }

    if( this.owner ) {
      var transform = this.owner.findComponent( 'Transform' );
      //Note: It is currently okay to read from buffers, but writing to them will result in things breaking
      if (this.service.dimensionMap === this.service.DimensionMaps.XY){
        this.box2dBody.SetTransform( new Box2D.b2Vec2( transform.position.buffer[0], transform.position.buffer[1] ), transform.rotation.buffer[2] );
      }else if (this.service.dimensionMap === this.service.DimensionMaps.XZ){
        this.box2dBody.SetTransform( new Box2D.b2Vec2( transform.position.buffer[0], transform.position.buffer[2] ), transform.rotation.buffer[1] );
      }else{
        this.box2dBody.SetTransform( new Box2D.b2Vec2( transform.position.buffer[2], transform.position.buffer[1] ), transform.rotation.buffer[0] );
      }
    }

    if( this.owner === null && data.previous !== null ) {
      this.provider.unregisterComponent( data.previous.id, this );
      this.box2dBody.SetActive( false );
      this.box2dBody.SetAwake( false );
    }
  }

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      this.provider.registerComponent( this.owner.id, this );
      this.box2dBody.SetActive( true );
      this.box2dBody.SetAwake( true );
    } else {
      this.provider.unregisterComponent( this.owner.id, this );
      this.box2dBody.SetActive( false );
      this.box2dBody.SetAwake( false );
    }
  }

  var prototype = {
    onLinearImpulse: onLinearImpulse,
    onAngularImpulse: onAngularImpulse,
    onUpdate: onUpdate,
    onEntitySpaceChanged: onEntitySpaceChanged,
    onComponentOwnerChanged: onComponentOwnerChanged,
    onEntityActivationChanged: onEntityActivationChanged
  };
  extend( Body.prototype, prototype );

  return Body;
});