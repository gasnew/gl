module.exports = function(sequelize, DataTypes) {
  var Inventory = sequelize.define('Inventory', {
    rows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    cols: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  });

  Inventory.associate = function(models) {
    Inventory.belongsTo(models.Player);
    Inventory.hasMany(models.InvSlot);
  };

  Inventory.protFuncs = function(models) {
    Inventory.prototype.makeSlots = async function(transaction) {
      for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) {
          await this.createInvSlot(
            { row: r, col: c },
            { transaction: transaction }
          );
        }
      }
    };

    Inventory.prototype.getAt = async function(row, col, transaction) {
      return await models.InvSlot.find({
        where: {
          InventoryId: this.id,
          row: row,
          col: col,
        },
        transaction: transaction,
      });
    };
  };

  return Inventory;
};
