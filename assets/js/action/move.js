game.Action.MoveRequest = Object.create(game.Action);

Object.assign(game.Action.MoveRequest, {
  init: function({fromTile, toTile}) {
    game.Action.init.call(this, 'move');

    this.content = {
      fromTile: fromTile,
      toTile: toTile,
    };
  },
});

