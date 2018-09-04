var game = {
  beginPhase: function (phase) {
    console.log(state);
    game.chunk = phase.state.chunk;
    game.entities.init(game.chunk, phase.state.entities);
    game.hud.init(game.chunk, game.entities, game.draw.canvas.cursor);
    game.draw.init();

    this.subscribeTurnUpdates();
  },

  subscribeTurnUpdates: async function() {
    var res = await game.Net.subscribeTurnUpdates();
    var player = game.entities.players.find(p => p.name == res.playerName);
    if (player) {
      player.turn = res.turn;
      player.fastForward();
      console.log(player.name + '\'s turn updated!');
    }

    this.subscribeTurnUpdates();
  },

  update: () => {
    game.draw.reset();

    game.hud.update();

    game.draw.chunk(game.chunk.tiles);
    game.draw.entities.players(game.entities.players);
    game.draw.entities.player(game.entities.player);
    game.draw.hud.windows(game.hud.windows);
    game.draw.hud.cursor(game.draw.canvas.cursor);
  },
};

