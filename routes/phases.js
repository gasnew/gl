var models = require('../models');
var express = require('express');
var router = express.Router();

var actionWatcher = {
  subscriptions: [],

  subscribe: function(PlayerId, latestActionId, onDispatch) {
    let subscription = {
      PlayerId,
      latestActionId,
      onDispatch,
    };
    this.subscriptions = this.subscriptions.filter(
      subscription => subscription.PlayerId !== PlayerId
    );
    this.subscriptions.push(subscription);
  },

  dispatch: async function(actionPlayerId) {
    for (var subscription of this.subscriptions) {
      if (subscription.PlayerId === actionPlayerId)
        continue;
      let actions = await models.Action.findAll({
        where: {
          Id: { [models.Sequelize.Op.gt]: subscription.latestActionId },
          PlayerId: { [models.Sequelize.Op.not]: subscription.PlayerId },
        },
      });
      await subscription.onDispatch(actions);
      subscription.dispatched = true;
    }

    this.subscriptions = this.subscriptions.filter(
      subscription => !subscription.dispatched
    );
  },
};

router.get('/state', async function(req, res) {
  const phase = await models.Phase.getCurrent();

  res.json({
    success: true,
    content: {
      snapshotIndex: phase.snapshotIndex,
      actions: await phase.getActions(),
      username: req.user.name,
    },
  });
});

router.post('/new-action', async function(req, res) {
  try {
    const player = await models.Player.findOne({
      where: { id: req.body.PlayerId },
    });
    const user = await player.getUser();
    if (req.user.name !== user.name)
      throw Error(
        `User name ${user.name} does not match request user name ${
          req.user.name
        }!`
      );

    const phase = await models.Phase.findOne({ where: { status: 'active' } });
    const action = await phase.integrateAction(req.body);

    res.json({
      success: true,
      content: {
        actionId: action.id,
      },
    });

    actionWatcher.dispatch(player.id);
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      content: String(e),
    });
  }
});

router.post('/subscribe-action-updates', async function(req, res) {
  const user = await models.User.findOne({ where: { name: req.user.name } });
  const player = await models.Player.findOne({ where: { UserId: user.id } });
  actionWatcher.subscribe(player.id, req.body.latestActionId, newActions => {
    res.json({
      success: true,
      content: { newActions: newActions },
    });
  });
});

module.exports = router;
