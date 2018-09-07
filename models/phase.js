var math = require('../lib/math');

module.exports = function(sequelize, DataTypes) {
  var Phase = sequelize.define('Phase', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    snapshotIndex: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Phase.associate = function(models) {
    Phase.hasMany(models.Action);
  };

  Phase.protFuncs = function(models) {
    Phase.prototype.integrateAction = async function(
      action,
      { transaction = null } = {}
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
      if (action.type == 'createUser') {
        const userInfo = action.content;
        const user = await models.User.create(userInfo, {
          transaction: transaction,
        });
        const player = await user.createPlayer(
          { x: 15, y: 15 },
          { transaction: transaction }
        );
        const inventory = await player.createInventory(
          { rows: 3, cols: 5 },
          { transaction: transaction }
        );
        await inventory.makeSlots(transaction);
        await (await inventory.getAt(0, 0, transaction)).createItem(
          {
            type: 'berry',
          },
          { transaction: transaction }
        );

        action.newRecords = {
          User: { [user.id]: user },
          Player: { [player.id]: player },
          Inventory: { [inventory.id]: inventory },
          InvSlot: (await inventory.getInvSlots({
            transaction: transaction,
          })).reduce(
            (slots, slot) => ({
              ...slots,
              [slot.id]: slot,
            }),
            {}
          ),
        };
        await action.save({ transaction: transaction });
      } else if (action.type == 'move') {
        const player = await action.getPlayer({ transaction: transaction });
        const toTile = await Phase.deserialize(action.content.toTile);
        const dist = math.tilesTo(player, toTile);
        if (dist !== 1) throw new Error('Invalid move of distance ' + dist);

        player.x = toTile.x;
        player.y = toTile.y;
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
  };

  Phase.classFuncs = function(models) {
    Phase.getCurrent = async function() {
      return await models.Phase.findOne({ where: { status: 'active' } });
    };

    Phase.getSnapshotIndex = async function() {
      const modelNames = [
        'Tile',
        'User',
        'Player',
        'Item',
        'Inventory',
        'InvSlot',
      ];
      let snapshotIndex = {};
      for (const modelName of modelNames) {
        snapshotIndex[modelName] = await models[modelName].all().reduce(
          (records, record) => ({
            ...records,
            [record.id]: record,
          }),
          {}
        );
      }
      return snapshotIndex;
    };

    Phase.deserialize = async function(serializedAsset) {
      return await models[serializedAsset.modelName].findOne({
        where: { id: serializedAsset.id },
      });
    };
  };

  return Phase;
};
