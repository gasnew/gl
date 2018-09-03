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

router.post('/new-action', async function(req, res) {
  try {
    var phase = await models.Phase.findOne({ where: { status: 'active' } });
    var action = await phase.integrateAction(req.body);

    res.json({
      success: true,
      content: {
        actionId: action.id,
      },
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      content: e,
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
