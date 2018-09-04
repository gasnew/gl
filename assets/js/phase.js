game.Phase = {
  verifiedActions: [],
  pendingActions: [],

  init: function(tiles) {
    this.tiles = tiles;
    // this.tiles = new Array(rows);
    // 
    // for (var i = 0; i < rows; i++) {
    //   this.tiles[i] = Array(cols);
    //   for (var j = 0; j < cols; j++) {
    //     var new_b = Object.create(game.Tile);
    //     this.tiles[i][j] = new_b.init(j, i);
    //   }
    // }
  },

  tileAt: function(row, col) {
    if (row < this.tiles.length && col < this.tiles[0].length) {
      return this.tiles[row][col];
    }

    return null;
  },
};

