if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  var Event = require( "core/event" );
  var math = require( "_math" );
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
    this.gravity = new Box2D.b2Vec2();
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
              
            new Event('ContactBegin', [entityA, entityB]).dispatch( [entityA, entityB] );
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

                new Event('ContactEnd', [entityA, entityB]).dispatch( [entityA, entityB] );
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

  var totalForce = new math.Vector2();

  function resolve() {
    var component;

    //Defining space here and then pulling the space from one of the components
    //because we do not currently have the ability to have multiple worlds.
    //Once we do each world will have a specific space
    var space;

    var registeredComponents = this._registeredComponents;

    //Go through the list of registered components,
    // add up all the global forces into gravity,
    // and then set the gravity on the world
    // TODO: Make sure that we transform each force according to the transforms of whatever parent objects it has
    totalForce.clear();
    var entityId;
    for (entityId in registeredComponents["Force"]){
      totalForce.add(registeredComponents["Force"][entityId].force);
    }

    this.gravity.Set(totalForce.x, totalForce.y);

    this.world.SetGravity(this.gravity);
    // Update all physics components
    var updateEvent = new Event( 'Update', undefined, false );
    for( var componentType in registeredComponents ) {
      for( entityId in registeredComponents[componentType] ) {
        component = registeredComponents[componentType][entityId];
        space = component.owner.space;
        while( component.handleQueuedEvent() ) {}
        updateEvent.dispatch( component );
      }
    }

    // Box2D steps in seconds
    this._timeRemaining += space.clock.delta;
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