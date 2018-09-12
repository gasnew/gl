game.Action.TransferRequest = Object.create(game.Action);

Object.assign(game.Action.TransferRequest, {
  init: function({ fromContainer, toContainer, item }) {
    game.Action.init.call(this, 'transfer');

    this.content = {
      fromContainer: fromContainer,
      toContainer: toContainer,
      item: item,
    };
  },
});
