if ( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}

define( function ( require ) {

  var Extension = require( "base/extension" );

  return new Extension( "gladius-box2d", {
      
      services: {
        "resolver": {
          service: require( "src/services/resolver" ),
          components: {
            "Body": require( "src/components/body" )
          },
          resources: {
          }
        }
      },
      
      components: {
      },
      
      resources: {
        "BodyDefinition": require( "src/resources/body-definition" ),
        "FixtureDefinition": require( "src/resources/fixture-definition" ),
        "BoxShape": require( "src/resources/box-shape" )
      }
      
  });

});
