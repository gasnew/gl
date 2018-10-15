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
      if (action.type === 'createUser') {
        const userInfo = action.content;
        const user = await models.User.create(userInfo, {
          transaction,
        });
        const player = await user.createPlayer(
          { x: 8, y: 8 },
          { transaction }
        );
        const inventory = await player.createInventory(
          { rows: 3, cols: 5 },
          { transaction }
        );
        const item = await inventory.createItem(
          {
            type: 'berry',
            x: 0,
            y: 0,
          },
          { transaction }
        );

        action.newRecords = [
          { modelName: 'User', data: user },
          { modelName: 'Player', data: player },
          { modelName: 'Inventory', data: inventory },
          { modelName: 'Item', data: item },
        ];

        await action.save({ transaction });
      } else if (action.type === 'attack') {
        const player = await action.getPlayer({ transaction });
      } else if (action.type === 'move') {
        const player = await action.getPlayer({ transaction });
        const toTile = action.content.toTile;
        const dist = math.tilesTo(player, toTile);
        if (dist !== 1) throw new Error('Invalid move of distance ' + dist);

        player.x = toTile.x;
        player.y = toTile.y;
        await player.save({ transaction });
      } else if (action.type === 'transfer') {
        console.log(action.content.fromContainer);
        var item = await models.Item.find({
          where: { id: action.content.item.id },
          transaction,
        });
        var c2Type = 'InvSlot';
        var c2 = await models[c2Type].find({
          id: action.content.toContainer.id,
          transaction,
        });

        // TODO Add validation here
        // - placed in different spot?
        // - placed within acceptable distance from player?
        if (1 != 1) throw new Error('Truth is not true');

        await c2.setItem(item, { transaction });
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
        'User',
        'Player',
        'Item',
        'Inventory',
        'Chunk',
        'Fixture',
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
