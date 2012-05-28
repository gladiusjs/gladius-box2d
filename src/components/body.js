if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {
  require("box2d");
  var extend = require( "common/extend" );
  var Component = require( "base/component" );
  var math = require( "_math" );

  var Body = function(options){
    options = options || {};
    var that = this;
    var i;

    if( options.bodyDefinition && options.world) {
      //TODO: Find out how cubicVR world and space sync up
      this._box2dBody = world.CreateBody( options.bodyDefinition );
    } else {
      throw 'missing body definition';
    }

    if( options.fixtureDefinition ) {
      this._box2dBody.CreateFixture( options.fixtureDefinition );
    }
    //TODO: Find out what this does
    this._box2dBody.component = this;  // TD: this might be a bad idea
    this._box2dBody.SetLinearVelocity( new Box2D.b2Vec2( 0, 0 ) );f

    Object.defineProperty(this, 'active', {
      get: function getActive() {
        return this._box2dBody.IsActive() ? true : false;
      },
      set: function setActive( val ) {
        return this._box2dBody.SetActive( val ) ? true : false;
      }
    });
  };
  Body.prototype = new Component();
  Body.prototype.constructor = Body;


  function onLinearImpulse( event ) {
    var linearImpulse = new Box2D.b2Vec2( 0, 0 );
    var impulse = event.data.impulse;
    linearImpulse.Set( impulse[0], impulse[1] );
    body.ApplyLinearImpulse( linearImpulse, body.GetPosition() );
    linearImpulse.Set( 0, 0 );
  };

  function onAngularImpulse( event ) {
    body.ApplyAngularImpulse( event.data.impulse );
  };

  //TODO: The things in here related to body's position and angle seem wrong. Check them
  function onUpdate( event ) {
    var position2 = body.GetPosition();
    var angle2 = body.GetAngle();

    // TD: This will cause the transform to emit an event that we handle below. Blech!
    var transform = this.owner.findComponent( 'Transform').absolute;
    transform.position = math.Vector3( position2.get_x(), position2.get_y(), transform.position[2] );
    transform.rotation = math.Vector3( transform.rotation[0], transform.rotation[1], angle2 );
  };

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
      service.registerComponent( this.owner.id, this );
      //TODO: Find out if these calls are still needed
      this._box2dBody.SetActive( true );
      this._box2dBody.SetAwake( true );
    }

    if( this.owner ) {
      var transform = this.owner.findComponent( 'Transform').absolute();
      this._box2dBody.SetTransform( new Box2D.b2Vec2( transform.position[0], transform.position[1] ), transform.rotation[2] );
    }

    if( this.owner === null && data.previous !== null ) {
      service.unregisterComponent( data.previous.id, this );
      this._box2dBody.SetActive( false );
      this._box2dBody.SetAwake( false );
    }
  };

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
  };

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