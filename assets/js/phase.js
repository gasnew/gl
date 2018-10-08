game.Phase = {
  index: {},
  actions: [],
  pendingActions: [],

  init: function({ state }) {
    this.index = this.connectInternally(this.digestIndex(state.snapshotIndex));
    console.log(this.index);
    this.actions = state.actions;
    console.log(this.actions);
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
        asset[relatedModelName] = index[relatedModelName][asset[property]];
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
        connectedIndex[modelName][id] = this.connect(
          index,
          asset
        );
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
        this.index[modelName][id] = this.connect(
          this.index,
          asset
        );
      }
    }
  },

  fastForward: function({ fromId } = {}) {
    let actions = fromId
      ? this.actions.filter(action => action.id >= fromId)
      : this.actions;
    for (const action of actions) {
      this.applyAction(action);
    }
  },

  fastForwardPendingActions: function() {
    for (const action of this.pendingActions) {
      this.applyAction(action);
    }
  },

  rewind: function({ throughId } = {}) {
    for (
      let i = this.actions.length - 1;
      i >= 0 && (!throughId || throughId <= this.actions[i].id);
      i--
    ) {
      this.undoAction(this.actions[i]);
    }
  },

  rewindPendingActions: function() {
    for (let i = this.pendingActions.length - 1; i >= 0; i--) {
      this.undoAction(this.pendingActions[i]);
    }
  },

  applyAction: function(action) {
    if (action.type === 'createUser') {
      this.digestAndMergeIntoIndex(action.newRecords);
    } else if (action.type === 'move') {
      const tile = action.content.toTile;
      const player = this.index.Player[action.PlayerId];

      player.x = tile.x;
      player.y = tile.y;
      player.tile = tile;
      //console.log('action', action.id, 'move to', tile.x, tile.y);
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
      const tile = action.content.fromTile;
      const player = this.index.Player[action.PlayerId];

      player.x = tile.x;
      player.y = tile.y;
      player.tile = tile;
      //console.log('undo action', action.id, 'move to', tile.x, tile.y);
    } else if (action.type === 'transfer') {
      var from = action.content.fromContainer;
      var to = action.content.toContainer;

      from.setContent(to.getContent());
      to.setContent(null);
    }
  },

  insertAction: function(actionToInsert, { removeFromPending = false } = {}) {
    this.rewindPendingActions();
    if (removeFromPending) {
      const verifiedAction = this.pendingActions.shift();
      if (actionToInsert !== verifiedAction)
        throw Error('pendingActions is screwed up for some reason!!');
    }

    let throughId = null;
    for (
      let i = this.actions.length - 1;
      i >= 0 && actionToInsert.id < this.actions[i].id;
      i--
    ) {
      throughId = this.actions[i].id;
    }
    let laterActions = [];
    if (throughId) {
      this.rewind({ throughId });
      laterActions = this.actions.splice(this.actions.indexOf(throughId));
    }
    this.actions.push(actionToInsert);
    this.actions = this.actions.concat(laterActions);
    this.fastForward({ fromId: actionToInsert.id });

    this.fastForwardPendingActions();
  },

  sendAction: async function(action) {
    try {
      this.pendingActions.push(action);
      var response = await game.Net.postAction(action);
      console.log('got action id', response.actionId);
      action.id = response.actionId;
      this.insertAction(action, { removeFromPending: true });
      console.log(action);
      console.log(this.actions);
    } catch (error) {
      console.error('Action failed!');
      console.error(error);
      this.rewindPendingActions();
      this.pendingActions.length = 0;
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
        fromTile: player.tile,
        toTile: tile,
      },
      PlayerId: player.id,
    });

    this.applyAction(moveRequest);
    this.sendAction(moveRequest);
  },
};
