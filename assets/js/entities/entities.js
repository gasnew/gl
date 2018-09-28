game.entities = {
  init: function({ chunk, username }) {
    this.chunk = chunk;

    this.username = username;
    const player = this.getMainPlayer();
    player.tile = chunk.tileAt({ row: player.y, col: player.x });
  },

  getMainPlayer: function() {
    return Object.values(game.phase.index.Player).find(
      p => p.User.name === this.username
    );
  },

  getPlayers: function() {
    return Object.values(game.phase.index.Player).filter(
      player => player.User.name !== this.username
    );
  },
};
