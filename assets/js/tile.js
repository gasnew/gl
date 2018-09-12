game.Tile = {
  init: function({ x, y }) {
    this.x = x;
    this.y = y;

    this.highlighted = false;

    return this;
  },

  highlight: function() {
    this.highlighted = true;
  },

  unhighlight: function() {
    this.highlighted = false;
  },
};
