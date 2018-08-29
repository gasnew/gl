var forever = require('forever-monitor');

var child = forever.start([ 'node server.js' ], {
  max: 2,
  watchDirectory: '.'
});

