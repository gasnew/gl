game.Phase = {
  index: {},
  verifiedActions: [],
  pendingActions: [],

  init: function({ state }) {
    this.index = this.connectInternally(this.digestIndex(state.snapshotIndex));
    console.log(this.index);
    this.verifiedActions = state.actions;
    console.log(this.verifiedActions);
    this.username = state.username;

    this.fastForward();
  },

  digestIndex: function(recordIndex) {
    return Object.keys(recordIndex).reduce(
      (indexAsAssets, modelName) => ({
        ...indexAsAssets,
        [modelName]: Object.keys(recordIndex[modelName]).reduce(
          (assets, id) => ({
            ...assets,
            [id]: game.Utils.create(modelName, recordIndex[modelName][id]),
          }),
          {}
        ),
      }),
      {}
    );
  },

  connect: function(index, asset) {
    for (let property of Object.keys(asset)) {
      if (property.endsWith('Id') && property !== 'Id') {
        const relatedModelName = property.replace('Id', '');
        asset[relatedModelName] =
          index[relatedModelName][asset[property]];
      }
    }

    return asset;
  },

  connectInternally: function(index) {
    let connectedIndex = {};
    for (let modelName of Object.keys(index)) {
      connectedIndex[modelName] = {};
      let assets = index[modelName];
      for (let id of Object.keys(assets)) {
        let asset = assets[id];
        connectedIndex[modelName][id] = this.connect(index, asset);
      }
    }

    return connectedIndex;
  },

  digestAndMergeIntoIndex: function(recordIndex) {
    for (const modelName of Object.keys(recordIndex)) {
      const records = recordIndex[modelName];
      for (const id of Object.keys(records)) {
        this.index[modelName][id] = game.Utils.create(modelName, records[id]);
      }
    }
    for (const modelName of Object.keys(recordIndex)) {
      const records = recordIndex[modelName];
      for (const id of Object.keys(records)) {
        const asset = this.index[modelName][id];
        this.index[modelName][id] = this.connect(this.index, asset);
      }
    }
  },

  fastForward: function() {
    for (const action of this.verifiedActions) {
      this.applyAction(action);
    }
  },

  rewind: function() {
    for (const action of this.verifiedActions.reverse()) {
      this.undoAction(action);
    }
  },

  applyAction: function(action) {
    if (action.type === 'createUser') {
      console.log(action.newRecords);
      this.digestAndMergeIntoIndex(action.newRecords);
      console.log('index');
      console.log(this.index);
    } else if (action.type === 'move') {
      const tile = this.deserialize(action.content.toTile);
      const player = this.index.Player[action.PlayerId];

      player.x = tile.x;
      player.y = tile.y;
      player.tile = tile;
    } else if (action.type === 'transfer') {
      var from = action.content.fromContainer;
      var to = action.content.toContainer;

      to.setContent(from.getContent());
      from.setContent(null);
    } else {
      console.error(`Unknown action type ${action.type}`);
    }
  },

  undoAction: function(action) {
    if (action.type === 'move') {
      const tile = this.deserialize(action.content.fromTile);
      const player = this.index.Player[action.PlayerId];

      player.x = tile.x;
      player.y = tile.y;
      player.tile = tile;
    } else if (action.type === 'transfer') {
      var from = action.content.fromContainer;
      var to = action.content.toContainer;

      from.setContent(to.getContent());
      to.setContent(null);
    }
  },

  sendAction: async function(action) {
    try {
      var actionId = await game.Net.postAction(action);
      console.log(actionId);
      this.pendingActions.push(action);
    } catch (error) {
      console.error('Action failed!');
      console.error(error);
      this.undoAction(action);
      this.rewind();
      this.pendingActions.splice(this.pendingActions.indexOf(action));
      this.fastForward();
    }
  },

  // ACTIONS
  serialize: function(modelName, asset) {
    return {
      modelName,
      id: asset.id,
    };
  },

  deserialize: function(serializedAsset) {
    return this.index[serializedAsset.modelName][serializedAsset.id];
  },

  moveTo: async function(player, tile) {
    var moveRequest = Object.create(game.Action.MoveRequest);
    moveRequest.init({
      content: {
        fromTile: this.serialize('Tile', player.tile),
        toTile: this.serialize('Tile', tile),
      },
      PlayerId: player.id,
    });
    moveRequest = this.connect(this.index, moveRequest);

    this.applyAction(moveRequest);
    this.sendAction(moveRequest);
  },
};
