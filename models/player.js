var models = require('../models');

module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define('Player', {
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Player.associate = function(models) {
    Player.hasMany(models.Turn);
    Player.belongsTo(models.User);
  };

  return Player;
};

