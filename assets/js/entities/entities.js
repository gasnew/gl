game.entities = {
  init: function({ chunk, players }) {
    this.chunk = chunk;

    const mainPlayer = players.find(player => player.User.name === 'gnew');
    this.player = mainPlayer;
    this.players = players.filter(player => player !== mainPlayer);
    this.player.tile = chunk.tileAt(this.player.y, this.player.x);
  },
};
