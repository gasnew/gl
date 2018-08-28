var repl = require('repl');

var models = require('./models');

var replServer = repl.start({});

replServer.context.models = models;
