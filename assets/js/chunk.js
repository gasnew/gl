game.Chunk = {
  init: function({ tiles }) {
    this.tiles = tiles;
  },

  tileAt: function(row, col) {
    if (row < this.tiles.length && col < this.tiles[0].length) {
      return this.tiles[row][col];
    }

    return null;
  },
};
