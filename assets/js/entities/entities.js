game.entities = {
  init: function({ chunk, players, username }) {
    this.chunk = chunk;

    const mainPlayer = players.find(player => player.User.name === username);
    this.player = mainPlayer;
    this.players = players.filter(player => player !== mainPlayer);
    this.player.tile = chunk.tileAt(this.player.y, this.player.x);
  },
};
