var bcrypt = require('bcryptjs'),
  Q = require('q'),
  models = require('./models');
const { actionWatcher } = require('./routes/phases.js');

//used in local-signup strategy
exports.localReg = async function(name, password) {
  var deferred = Q.defer();

  console.log(name);
  //check if name is already assigned in our database
  var result = await models.User.findOne({
    where: {
      name: name,
    },
  });
  if (null != result) {
    console.log('USERNAME ALREADY EXISTS:', result.name);
    deferred.resolve(false); // name exists
  } else {
    var hash = bcrypt.hashSync(password, 8);
    var user = {
      name: name,
      password: hash,
    };

    console.log('CREATING USER:', name);
    const phase = await models.Phase.getCurrent();
    const newAction = await phase.integrateAction({
      type: 'createUser',
      content: user,
    });
    // Need to dispatch here as well since it is the only action that is not
    // managed by the phases controller
    const player = await (await models.User.findOne({
      where: { name: user.name },
    })).getPlayer();
    newAction.PlayerId = player.id;
    await newAction.save();
    await actionWatcher.dispatch(player.id);

    deferred.resolve(user);
  }

  return deferred.promise;
};

//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function(name, password) {
  var deferred = Q.defer();

  models.User.findOne({
    where: {
      name: name,
    },
  }).then(function(result) {
    if (null == result) {
      console.log('USERNAME NOT FOUND:', name);

      deferred.resolve(false);
    } else {
      var hash = result.password;

      console.log('FOUND USER: ' + result.name);

      if (bcrypt.compareSync(password, hash)) {
        deferred.resolve(result);
      } else {
        console.log('AUTHENTICATION FAILED');
        deferred.resolve(false);
      }
    }
  });

  return deferred.promise;
};
