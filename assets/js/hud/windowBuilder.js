game.hud.WindowBuilder = {
  start: function({x = 0, y = 0}) {
    this.window = Object.create(game.hud.Window);
    this.window.init({x: x, y: y});

    return this;
  },

  addTitle: function({name = 'Default Title'} = {}) {
    var cell = Object.create(game.hud.Cell);
    cell.init({
      height: game.draw.TILE_SIZE,
      width: null,
      content: {text: name, size: game.draw.TILE_SIZE},
      onDrawContent: (text, x, y) => game.draw.text(text, x, y),
    });
    this.window.addPane({cells: [cell]});

    return this;
  },

  addInventory: function({inv = {rows: 0, cols: 0}} = {}) {
    var cellRows = Array(inv.rows);
    for (var r = 0; r < inv.rows; r++) {
      cellRows[r] = Array(inv.cols);
      for (var c = 0; c < inv.cols; c++) {
        let slot = inv.slots[r][c];
        let cell = Object.create(game.hud.Cell);
        cell.init({
          x: 0,
          y: 0,
          height: game.draw.TILE_SIZE,
          width: game.draw.TILE_SIZE,
          onDown: function() {
            if (!game.draw.canvas.cursor.getItem()) {
              game.draw.canvas.cursor.setItem(this.content);
              this.setContent(null);
            } else if (this.empty()) {
              this.setContent(game.draw.canvas.cursor.getItem());
              game.draw.canvas.cursor.setItem(null);
            }
          },
          onDrawContent: (item, x, y) => game.draw.item(item, x, y),
        });

        cell.setContent(slot.item);

        cellRows[r][c] = cell;
      }
    }

    for (var cellRow of cellRows) {
      this.window.addPane({
        x: 0,
        y: this.window.getBottom() - this.window.y,
        cells: cellRow,
      });
    }

    return this;
  },

  finish: function() {
    this.window.height = this.window.getHeight();
    this.window.width = this.window.getWidth();

    return this.window;
  },
};
