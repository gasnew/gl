game.Fixture = {
  init: function({ id, type, x, y, ChunkId}) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.ChunkId = ChunkId;

    return this;
  },
};
