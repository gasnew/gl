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
    Player.hasMany(models.Phase);
    Player.belongsTo(models.User);
    Player.hasOne(models.Inventory);
  };

  return Player;
};

