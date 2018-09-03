var math = require('../lib/math');

module.exports = function(sequelize, DataTypes) {
  var Phase = sequelize.define('Phase', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.JSON,
    },
  });

  Phase.associate = function(models) {
    Phase.hasMany(models.Action);
  };

  Phase.protFuncs = function(models) {
    Phase.prototype.integrateAction = async function(
      action,
      { transaction = null }
    ) {
      try {
        var newActionTransaction =
          transaction || (await models.sequelize.transaction());

        var newAction = await models.Action.create(action, {
          transaction: newActionTransaction,
        });
        await this.addAction(newAction, { transaction: newActionTransaction });

        await this.performAction(newAction, newActionTransaction);
        await newActionTransaction.commit();

        return newAction;
      } catch (error) {
        await newActionTransaction.rollback();

        throw error;
      }
    };

    Phase.prototype.performAction = async function(action, transaction) {
      if (action.type == 'move') {
        var player = await this.getPlayer({ transaction: transaction });
        var dist = math.tilesTo(player, action.content.toTile);
        if (dist !== 1) throw new Error('Invalid move of distance ' + dist);

        player.x = action.content.toTile.x;
        player.y = action.content.toTile.y;
        await player.save({ transaction: transaction });
      } else if (action.type == 'transfer') {
        console.log(action.content.fromContainer);
        var item = await models.Item.find({
          where: { id: action.content.item.id },
          transaction: transaction,
        });
        var c2Type = 'InvSlot';
        var c2 = await models[c2Type].find({
          id: action.content.toContainer.id,
          transaction: transaction,
        });

        // TODO Add validation here
        // - placed in different spot?
        // - placed within acceptable distance from player?
        if (1 != 1) throw new Error('Truth is not true');

        await c2.setItem(item, { transaction: transaction });
      } else {
        throw new Error('No action of type ' + action.type);
      }
    };

    Phase.prototype.createSnapshot = async function() {
      let modelNames = [
        'Tile',
        'Player',
        'Item',
        'InvSlot',
      ];
      let snapshot = {
        form: {
          Tile: {},
          Player: {},
          Item: {},
          InvSlot: {},
        },
        index: await modelNames.reduce(async (index, modelName) => (
          index[modelName] = await models[modelName].all()
        ), {}),
      };
    };
  };

  return Phase;
};
