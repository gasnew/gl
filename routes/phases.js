var models = require('../models');
var express = require('express');
var router = express.Router();

var actionWatcher = {
  subscriptions: [],

  subscribe: function(latestActionId, onDispatch) {
    let subscription = {
      latestActionId,
      onDispatch,
    };
    this.subscriptions.push(subscription);
  },

  dispatch: async function() {
    for (var subscription of this.subscriptions) {
      let actions = await models.Action.findAll({
        where: {
          Id: { [models.Sequelize.Op.gt]: subscription.latestActionId },
        },
      });
      subscription.onDispatch(actions);
    }

    this.subscriptions.length = 0;
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
  } catch (e) {
    console.error(e);
    console.log(`error: ${e}`);
    res.json({
      success: false,
      content: String(e),
    });
  }

  actionWatcher.dispatch();
});

router.post('/subscribe-action-updates', function(req, res) {
  actionWatcher.subscribe(req.body.latestActionId, newActions => {
    res.json({
      success: true,
      content: newActions,
    });
  });
});

module.exports = router;
