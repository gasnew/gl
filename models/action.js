var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    type: DataTypes.STRING,
    content: DataTypes.TEXT,
  });

  Action.associate = function(models) {
    Action.belongsTo(models.Turn);
  };

  return Action;
};

