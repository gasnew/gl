var game = {
  beginPhase: function(stage, phase) {
    game.keys.bind();

    game.phase = phase;

    game.chunk = game.phase.index.Chunk[1];

    game.entities.init({
      chunk: game.chunk,
      username: phase.username,
    });

    game.camera.init();

    game.controls.init();

    stage.addChild(game.sidebar.init());
    stage.addChild(game.draw.init());

    this.subscribeActionUpdates(
      game.phase.actions[game.phase.actions.length - 1].id
    );
  },

  subscribeActionUpdates: async function(lastActionId, attempts = 0) {
    try {
      const response = await game.Net.subscribeActionUpdates(lastActionId);
      const newActions = response.newActions;
      for (const action of newActions) game.phase.insertAction(action);

      this.subscribeActionUpdates(newActions[newActions.length - 1].id);
    } catch (error) {
      console.log(`Attempt ${attempts + 1}: Waiting 1 second to retry...`);
      await game.Utils.sleep(1000);
      this.subscribeActionUpdates(lastActionId, attempts + 1);
    }
  },

  update: delta => {
    game.camera.update();

    game.draw.update(delta, game.camera.rotation);

    //game.draw.hud.windows(game.hud.windows);
    //game.draw.hud.cursor(game.draw.canvas.cursor);
  },
};
