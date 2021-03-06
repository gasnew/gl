module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Item.associate = function(models) {
    Item.belongsTo(models.Chunk);
    Item.belongsTo(models.Inventory);
  };

  return Item;
};

