module.exports = function(sequelize, DataTypes) {
  var Inventory = sequelize.define('Inventory', {
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  });

  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Player);
    Inventory.hasMany(models.Item);
  };

  return Inventory;
};
