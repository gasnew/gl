game.Action.MoveRequest = Object.create(game.Action);

Object.assign(game.Action.MoveRequest, {
  init: function({ id, content: { fromTile, toTile }, PlayerId }) {
    game.Action.init.call(this, { id, type: 'move', PlayerId });

    this.content = {
      fromTile: fromTile,
      toTile: toTile,
    };
  },
});
