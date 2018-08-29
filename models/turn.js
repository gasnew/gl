var math = require('../lib/math');

module.exports = function(sequelize, DataTypes) {
  var Turn = sequelize.define('Turn', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Turn.associate = function(models) {
    Turn.belongsTo(models.Player);
    Turn.hasMany(models.Action);
  };

  Turn.classFuncs = function(models) {};

  Turn.protFuncs = function(models) {
    Turn.prototype.integrateAction = async function(action) {
      try {
        var newActionTransaction = await models.sequelize.transaction();
        var simulationTransaction = await models.sequelize.transaction();

        var newAction = await models.Action.create(action, {
          transaction: newActionTransaction,
        });
        await this.addAction(newAction, { transaction: newActionTransaction });

        await this.perform(simulationTransaction, newAction);
        await simulationTransaction.rollback();
        await newActionTransaction.commit();

        return await this.toPostObj();
      } catch (e) {
        await simulationTransaction.rollback();
        await newActionTransaction.rollback();

        throw e;
      }
    };

    Turn.prototype.finish = async function(force = false) {
      try {
        if (!force) {
          var t = await models.sequelize.transaction();

          await this.perform(t);
          await t.commit();
        }

        this.status = 'done';
        await this.save();

        return await this.toPostObj();
      } catch (e) {
        await t.rollback();

        throw e;
      }
    };

    Turn.prototype.perform = async function(t, newAction) {
      var actions = await this.getActions();
      for (var a of actions) {
        await this.performAction(a, t);
      }
      if (newAction) await this.performAction(newAction, t);
    };

    Turn.prototype.performAction = async function(a, t) {
      if (a.type == 'move') {
        var player = await this.getPlayer({ transaction: t });
        var dist = math.tilesTo(player, a.content.toTile);
        if (dist !== 1) throw new Error('Invalid move of distance ' + dist);

        player.x = a.content.toTile.x;
        player.y = a.content.toTile.y;
        await player.save({ transaction: t });
      } else if (a.type == 'transfer') {
        console.log(a.content.fromContainer);
        var item = await models.Item.find({
          where: { id: a.content.item.id },
          transaction: t,
        });
        var c2Type = 'InvSlot';
        var c2 = await models[c2Type].find({
          id: a.content.toContainer.id,
          transaction: t,
        });

        // TODO Add validation here
        // - placed in different spot?
        // - placed within acceptable distance from player?
        if (1 != 1) throw new Error('Truth is not true');

        await c2.setItem(item, { transaction: t });
      } else {
        throw new Error('No action of type ' + a.type);
      }
    };

    Turn.prototype.toPostObj = async function() {
      var actions = await this.getActions();
      return actions.map(a => a.dataValues);
    };
  };

  return Turn;
};
