if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var Event = require( "core/event" );
  require( "box2d" );

  var Resolver = function( scheduler, options ) {
    options = options || {};

    var schedules = {
      "resolve": {
        tags: ["@update", "physics"],
        dependsOn: []
      }
    };
    Service.call( this, scheduler, schedules );

    options.gravity = options.gravity || [0, 0];
    this.gravity = new Box2D.b2Vec2( options.gravity[0], options.gravity[1] );
    this.world = new Box2D.b2World( this.gravity );
    this._timeStep = 30;  // time step, in milliseconds
    this._timeRemaining = 0;    // time remaining from last frame, in milliseconds

    var contactListener = new Box2D.b2ContactListener();
    Box2D.customizeVTable( contactListener,
      [
        {
          original: Box2D.b2ContactListener.prototype.BeginContact,
            replacement: function( objPtr, contactPtr ) {
            var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
            var entityA = bodyA.component.owner;
            var entityB = bodyB.component.owner;
              
            new engine.core.Event({
              type: 'ContactBegin',
              data: {
                entities: [entityA, entityB]
              }
            }).dispatch( [entityA, entityB] );
          }
        },
        {
            original: Box2D.b2ContactListener.prototype.EndContact,
            replacement: function( objPtr, contactPtr ) {
                var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
                var bodyA = fixtureA.GetBody();
                var bodyB = fixtureB.GetBody();
                var entityA = bodyA.component.owner;
                var entityB = bodyB.component.owner;
                
                if( !bodyA.component.owner || !bodyB.component.owner ) {
                  return;
                }

                new engine.core.Event({
                    type: 'ContactEnd',
                    data: {
                      entities: [entityA, entityB]
                  }
              }).dispatch( [entityA, entityB] );
            }
        },
        {
            original: Box2D.b2ContactListener.prototype.PreSolve,
            replacement: function( objPtr, contactPtr, oldManifoldPtr ) {
                var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
            }
        },
        {
            original: Box2D.b2ContactListener.prototype.PostSolve,
            replacement: function( objPtr, contactPtr, oldManifoldPtr ) {
                var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
            }
        }
    ]);
    this.world.SetContactListener( contactListener );
  };

  function resolve() {
    var component;

    // Update all graphics components
    var updateEvent = new Event( 'Update', false );
    for( var componentType in registeredComponents ) {
      for( var entityId in registeredComponents[componentType] ) {
        component = registeredComponents[componentType][entityId];
        while( component.handleQueuedEvent() ) {}
        updateEvent( component );
      }
    }

    // Box2D steps in seconds
    this._timeRemaining += that.time.delta;
    while( this._timeRemaining >= this._timeStep ) {
      this.world.Step( this._timeStep/1000, 2, 2 );
      this._timeRemaining -= this._timeStep;
    }
  }

  Resolver.prototype = new Service();
  Resolver.prototype.constructor = Resolver;
  Resolver.prototype.resolve = resolve;

  return Resolver;

});