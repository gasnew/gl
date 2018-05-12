game.hud.Cell = {
  init: function({
    x = 0,
    y = 0,
    height = game.draw.TILE_SIZE,
    width = game.draw.TILE_SIZE,
    onDown = () => {},
    onDrawContent = () => {},
    content = null,
    getContent = function() {
      return this.content;
    },
    setContent = function(content) {
      this.content = content;
    },
  } = {}) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.onDown = onDown;
    this.onDrawContent = onDrawContent;
    this.getContent = getContent;
    this.setContent = setContent;
    this.content = content;
  },

  empty: function() {
    return this.getContent() == null;
  },
};

