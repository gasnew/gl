game.entities.Player = {
  init: function(name, x, y, tile, inventory) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.inventory = inventory;
    this.turn = null;

    return this;
  },

  // MOVE
  moveTo: async function(tile) {
    var moveRequest = Object.create(game.Action.MoveRequest);
    moveRequest.init({
      fromTile: this.tile,
      toTile: tile
    });

    this.applyAction(moveRequest);
    this.sendAction(moveRequest);
  },

  // TRANSFER
  transferFromContainer: null,
  transferThroughContainer: null,
  startTransfer: function({from, through}) {
    through.setContent(from.getContent());
    from.setContent(null);

    this.transferFromContainer = from;
    this.transferThroughContainer = through;
    console.log('transfer started');
  },
  pendingTransfer: function() {
    return this.transferFromContainer != null;
  },
  completeTransfer: function({to}) {
    var from = this.transferFromContainer;
    var through = this.transferThroughContainer;

    from.setContent(through.getContent());
    through.setContent(null);

    console.log('transfer completed');
    var transferRequest = Object.create(game.Action.TransferRequest);
    transferRequest.init({
      fromContainer: from,
      toContainer: to,
      item: from.getContent()
    });

    this.applyAction(transferRequest);
    this.sendAction(transferRequest);
    console.log(transferRequest);

    this.transferFromContainer = null;
  },

  fastForward: function() {
    for (var action of this.turn) {
      this.applyAction(action);
    }
  },

  rewind: function() {
    for (var action of this.turn.reverse()) {
      this.undoAction(action);
    }
  },

  applyAction: function(action) {
    if (action.type === 'move') {
      var tile = action.content.toTile;

      this.x = tile.x;
      this.y = tile.y;
      this.tile = tile;
    } else if(action.type === 'transfer') {
      var from = action.content.fromContainer;
      var to = action.content.toContainer;

      to.setContent(from.getContent());
      from.setContent(null);
    }
  },

  undoAction: function(action) {
    if (action.type === 'move') {
      var tile = action.content.fromTile;

      this.x = tile.x;
      this.y = tile.y;
      this.tile = tile;
    } else if(action.type === 'transfer') {
      var from = action.content.fromContainer;
      var to = action.content.toContainer;

      from.setContent(to.getContent());
      to.setContent(null);
    }
  },

  sendAction: async function(action) {
    try {
      var turnJSON = await game.Net.postAction(action);
      console.log(turnJSON);
      this.turn.push(action);
    } catch(turnJSON) {
      console.error('Action failed!');
      this.undoAction(action);
      this.rewind();
      this.turn.splice(turnJSON.length, this.turn.length);
      this.fastForward();
    }
  },
};

