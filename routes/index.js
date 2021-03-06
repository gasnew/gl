var path = require('path');
var models = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
  }

  console.log(req.session);
  res.sendFile(path.join(__dirname, '/../assets/index.html'));
});

//displays our signup page
router.get('/signin', function(req, res){
  res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.name;
  console.log("LOGGIN OUT " + req.user.name);
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

module.exports = router;

