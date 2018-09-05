game.Tile = {
  id: 0,
  x: 0,
  y: 0,
  highlighted: false,

  init: function({id, x, y}) {
    this.id = id;
    this.x = x;
    this.y = y;

    return this;
  },

  highlight: function() {
    this.highlighted = true;
  },

  unhighlight: function() {
    this.highlighted = false;
  },
};

