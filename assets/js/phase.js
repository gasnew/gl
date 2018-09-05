game.Phase = {
  index: {},
  verifiedActions: [],
  pendingActions: [],

  init: function({ state }) {
    this.index = this.connect(this.digestIndex(state.snapshotIndex));
    console.log(this.index);
    this.verifiedActions = state.actions;
    console.log(this.verifiedActions);

    this.fastForward();
  },

  digestIndex: function(index) {
    return Object.keys(index).reduce(
      (indexWithFunctions, modelName) => ({
        ...indexWithFunctions,
        [modelName]: Object.keys(index[modelName]).reduce(
          (recordsWithFunctions, id) => ({
            ...recordsWithFunctions,
            [id]: game.Utils.create(modelName, index[modelName][id]),
          }),
          {}
        ),
      }),
      {}
    );
  },

  connect: function(index) {
    return index;
  },

  digestAndMergeIntoIndex: function(index) {
    for (const modelName of Object.keys(index)) {
      const records = index[modelName];
      for (const id of Object.keys(records)) {
        this.index[modelName][id] = game.Utils.create(modelName, records[id]);
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
    } else if (action.type === 'move') {
      const tile = action.content.toTile;

      this.x = tile.x;
      this.y = tile.y;
      this.tile = tile;
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
      var tile = action.content.fromTile;

      this.x = tile.x;
      this.y = tile.y;
      this.tile = tile;
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
      this.turn.push(action);
    } catch (turnJSON) {
      console.error('Action failed!');
      this.undoAction(action);
      this.rewind();
      this.turn.splice(turnJSON.length, this.turn.length);
      this.fastForward();
    }
  },
};
