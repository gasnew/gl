game.Action.AttackRequest = Object.create(game.Action);

Object.assign(game.Action.attackRequest, {
  init: function({ id, content: { targetEntity, newRecords }, PlayerId }) {
    game.Action.init.call(this, { id, type: 'move', PlayerId });

    this.content = {
      fromTile: fromTile,
      toTile: toTile,
    };
  },

  createActionPayload: function() {
    return this.content;
  }
});
