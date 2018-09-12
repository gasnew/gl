game.hud = {
  init: function(chunk, entities, cursor) {
    this.chunk = chunk;
    this.entities = entities;
    this.cursor = cursor;
    this.player = entities.getMainPlayer();

    this.highTile = null;
    this.downTile = null;

    this.windows = {
      inv: game.hud.WindowBuilder.start({x: 100, y: 50})
        .addTitle({name: this.player.name})
        .addInventory({inv: this.player.inventory})
        .finish()
    };
    console.log(this.windows);
  },

  update: function() {
    this.highlightTile();
    var clickedTile = this.getClickedTile();

    if (clickedTile
        && game.Math.tilesTo(this.player.tile, clickedTile) === 1) {
      this.player.moveTo(clickedTile);
    }
  },

  highlightTile: function() {
    var row = this.cursor.row;
    var col = this.cursor.column;

    if (this.highTile) this.highTile.unhighlight();
    this.highTile = this.chunk.tileAt(row, col);
    if (this.highTile) this.highTile.highlight();
  },

  getClickedTile: function() {
    var db = this.downTile;
    var hb = this.highTile;
    var c = this.cursor;

    if (!db && c.down)
      this.downTile = hb;
    if (!c.down) {
      this.downTile = null;
      if (db === hb)
        return db;
    }

    return null;
  },
};

