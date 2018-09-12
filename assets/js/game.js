var game = {
  beginPhase: function(phase) {
    game.phase = phase;

    game.chunk = game.phase.index.Chunk[1];

    game.entities.init({
      chunk: game.chunk,
      username: phase.username,
    });
    game.hud.init(game.chunk, game.entities, game.draw.canvas.cursor);
    game.draw.init();

    this.subscribeActionUpdates(
      game.phase.actions[game.phase.actions.length - 1].id
    );
  },

  subscribeActionUpdates: async function(lastActionId) {
    const response = await game.Net.subscribeActionUpdates(lastActionId);
    const newActions = response.newActions;
    for (const action of newActions) game.phase.insertAction(action);

    this.subscribeActionUpdates(newActions[newActions.length - 1].id);
  },

  update: () => {
    game.draw.reset();

    game.hud.update();

    game.draw.chunk(game.chunk.tiles);
    game.draw.entities.players(game.entities.getPlayers());
    game.draw.entities.player(game.entities.getMainPlayer());
    game.draw.hud.windows(game.hud.windows);
    game.draw.hud.cursor(game.draw.canvas.cursor);
  },
};
