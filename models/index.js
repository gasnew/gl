var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];
var db = {};

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].classFuncs) {
    console.log(modelName);
    db[modelName].classFuncs(db);
  }
  if (db[modelName].protFuncs) {
    db[modelName].protFuncs(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// sequelize.sync();

module.exports = db;

sequelize
  .authenticate()
  .then(() => {
    console.log('YOU DID IT');
  })
  .catch(err => {
    console.error('YOU DID NOT DO IT: ', err);
  });
