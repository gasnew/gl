game.Player = {
  init: function({ id, name, x, y, UserId }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.UserId = UserId;

    return this;
  },

  // MOVE
  moveTo: function(tile) {
    game.phase.moveTo(this, tile);
  },

  // TRANSFER
  transferFromContainer: null,
  transferThroughContainer: null,
  startTransfer: function({ from, through }) {
    through.setContent(from.getContent());
    from.setContent(null);

    this.transferFromContainer = from;
    this.transferThroughContainer = through;
    console.log('transfer started');
  },
  pendingTransfer: function() {
    return this.transferFromContainer != null;
  },
  completeTransfer: function({ to }) {
    var from = this.transferFromContainer;
    var through = this.transferThroughContainer;

    from.setContent(through.getContent());
    through.setContent(null);

    console.log('transfer completed');
    var transferRequest = Object.create(game.Action.TransferRequest);
    transferRequest.init({
      fromContainer: from,
      toContainer: to,
      item: from.getContent(),
    });

    this.applyAction(transferRequest);
    this.sendAction(transferRequest);
    console.log(transferRequest);

    this.transferFromContainer = null;
  },
};
