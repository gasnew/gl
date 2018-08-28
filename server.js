// IMPORTS
var express = require('express');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var path = require('path');

var routes = require('./routes/index.js');
var users = require('./routes/users.js');
var players = require('./routes/players.js');
var inventories = require('./routes/inventories.js');
var chunks = require('./routes/chunks.js');
var turns = require('./routes/turns.js');

// CONFIGURE APP
var app = express();
app.set('port', 8080);
app.use(express.static(path.join(__dirname, 'assets'), { index: false }));

// SET MIDDLEWARE
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(
  session({ secret: 'supernova', saveUninitialized: true, resave: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next) {
  var err = req.session.error,
    msg = req.session.notice,
    success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

// Configure express to use handlebars templates
var hbs = exphbs.create({
  defaultLayout: 'main', //we will be creating this layout shortly
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// SET ROUTES
app.use('/', routes);
app.use(ensureAuthenticated);
app.use('/users', users);
app.use('/players', players);
app.use('/inventories', inventories);
app.use('/chunks', chunks);

app.use('/turns', turns);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}

// START SERVER
console.log(app.get('port'));
app.listen(app.get('port'));

//We will be creating these two files shortly
var funct = require('./auth_funcs.js'); //funct file contains our helper functions for our Passport and database work

//===============PASSPORT===============

// Use the LocalStrategy within Passport to name/"signin" users.
passport.use(
  'local-signin',
  new LocalStrategy(
    { passReqToCallback: true }, //allows us to pass back the request to the callback
    function(req, name, password, done) {
      funct
        .localAuth(name, password)
        .then(function(user) {
          if (user) {
            console.log('LOGGED IN AS: ' + user.name);
            req.session.success =
              'You are successfully logged in ' + user.name + '!';
            done(null, user);
          }
          if (!user) {
            console.log('COULD NOT LOG IN');
            req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
            done(null, user);
          }
        })
        .fail(function(err) {
          console.log(err.body);
        });
    }
  )
);
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use(
  'local-signup',
  new LocalStrategy(
    { passReqToCallback: true }, //allows us to pass back the request to the callback
    async function(req, name, password, done) {
      console.log(name);
      var user = await funct.localReg(name, password);
      try {
        if (user) {
          console.log('REGISTERED: ' + user.name);
          req.session.success =
            'You are successfully registered and logged in ' + user.name + '!';
          done(null, user);
        }
        if (!user) {
          console.log('COULD NOT REGISTER');
          req.session.error =
            'That name is already in use, please try a different one.'; //inform user could not log them in
          done(null, user);
        }
      } catch (err) {
        console.log(err.body);
      }
    }
  )
);

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log('serializing ' + user.name);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserializing ' + obj);
  done(null, obj);
});
