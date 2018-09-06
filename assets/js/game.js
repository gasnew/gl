var game = {
  beginPhase: function(phase) {
    game.phase = phase;

    const tiles = Object.values(phase.index.Tile);
    game.chunk = game.Utils.create('Chunk', {
      tiles: game.Utils.arrange({
        items: tiles,
        numRows: 25,
        numColumns: 25,
        getRow: tile => tile.y,
        getColumn: tile => tile.x,
      }),
    });

    game.entities.init({
      chunk: game.chunk,
      players: Object.values(phase.index.Player),
    });
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
      console.log(player.name + "'s turn updated!");
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
