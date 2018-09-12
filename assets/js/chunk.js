game.Chunk = {
  init: function({ height, width }) {
    this.height = height;
    this.width = width;

    this.tiles = Array(height);
    for (let row = 0; row < height; row++) {
      this.tiles[row] = Array(width);
      for (let column = 0; column < width; column++) {
        this.tiles[row][column] = game.Utils.create('Tile', {
          x: column,
          y: row,
        });
      }
    }
  },

  tileAt: function(row, col) {
    if (row < this.tiles.length && col < this.tiles[0].length) {
      return this.tiles[row][col];
    }

    return null;
  },
};
