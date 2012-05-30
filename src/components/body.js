if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require("box2d");
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var math = require( "_math" );

  var Body = function(service, options){
    options = options || {};
    var that = this;
    var i;
    this.service = service;

    if( options.bodyDefinition && options.world) {
      this.box2dBody = service.resolver.world.CreateBody( options.bodyDefinition );
    } else {
      throw 'missing body definition';
    }

    if( options.fixtureDefinition ) {
      this.box2dBody.CreateFixture( options.fixtureDefinition );
    }
    //TODO: Find out what this does
    this.box2dBody.component = this;  // TD: this might be a bad idea
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


  function onLinearImpulse( event ) {
    var linearImpulse = new Box2D.b2Vec2( 0, 0 );
    var impulse = event.data.impulse;
    linearImpulse.Set( impulse[0], impulse[1] );
    //TODO: Find out if we want to use the box2dBody's position here or not
    this.box2dBody.ApplyLinearImpulse( linearImpulse, this.box2dBody.GetPosition() );
    linearImpulse.Set( 0, 0 );
  }

  function onAngularImpulse( event ) {
    this.box2dBody.ApplyAngularImpulse( event.data.impulse );
  }

  //TODO: The things in here related to body's position and angle seem wrong. Check them
  function onUpdate( event ) {
    //TODO: Check if we need to be getting position and angle here another way
    var position2 = this.box2dBody.GetPosition();
    var angle2 = this.box2dBody.GetAngle();

    // TD: This will cause the transform to emit an event that we handle below. Blech!
    var transform = this.owner.findComponent( 'Transform').absolute;
    transform.position = math.Vector3( position2.get_x(), position2.get_y(), transform.position[2] );
    transform.rotation = math.Vector3( transform.rotation[0], transform.rotation[1], angle2 );
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
      //TODO: Find out if this call is wrong
      this.service.registerComponent( this.owner.id, this );
      //TODO: Find out if these calls are still needed
      this.box2dBody.SetActive( true );
      this.box2dBody.SetAwake( true );
    }

    if( this.owner ) {
      var transform = this.owner.findComponent( 'Transform').absolute();
      this.box2dBody.SetTransform( new Box2D.b2Vec2( transform.position[0], transform.position[1] ), transform.rotation[2] );
    }

    if( this.owner === null && data.previous !== null ) {
      //TODO: Find out if this call is wrong
      this.service.unregisterComponent( data.previous.id, this );
      this.box2dBody.SetActive( false );
      this.box2dBody.SetAwake( false );
    }
  }

//  TODO: Find out what this did and if it's needed anymore
//  function onEntityManagerChanged( e ) {
//    if( e.data.previous === null && e.data.current !== null && this.owner !== null ) {
//      service.registerComponent( this.owner.id, this );
//      body.SetActive( true );
//      body.SetAwake( true );
//    }
//
//    if( e.data.previous !== null && e.data.current === null && this.owner !== null ) {
//      service.unregisterComponent( this.owner.id, this );
//      body.SetActive( false );
//      body.SetAwake( false );
//    }
//  };

  function onEntityActivationChanged( event ) {
    var active = event.data;
    if( active ) {
      this.provider.registerComponent( this.owner.id, this );
    } else {
      this.provider.unregisterComponent( this.owner.id, this );
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
});