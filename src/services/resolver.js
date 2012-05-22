if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Service = require( "base/service" );
  require( "box2d" );

  var Resolver = function( scheduler, options ) {
    options = options || {};

    var schedules = {
      "resolve": {
        tags: ["@update", "physics"],
        dependsOn: []
      }
    }
    Service.call( this, scheduler, schedules );

    this.gravity = new Box2D.b2Vec2( options.gravity[0], options.gravity[1] ) ||
                   new Box2D.b2Vec2( 0, 0 );
    this.world = new Box2D.b2World( this.gravity );

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
    world.SetContactListener( contactListener );
  };

  function resolve() {

  }

  Resolver.prototype = new Service();
  Resolver.prototype.constructor = Resolver;
  Resolver.prototype.resolve = resolve;

});