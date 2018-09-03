var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    type: DataTypes.STRING,
    content: DataTypes.JSON,
  });

  Action.associate = function(models) {
    Action.belongsTo(models.Phase);
  };

  return Action;
};

