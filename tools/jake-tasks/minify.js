var jake = require( "jake" );

module.exports = function() {
  var cmds = [
              "uglifyjs --output dist/gladius-box2d.min.js dist/gladius-box2d.js"
              ];
  var callback = function() {
  };
  var opts = {
      stdout: true,
      stderr: true,
      breakOnError: false
  };

  jake.exec( cmds, callback, opts );
};
