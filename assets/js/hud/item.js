game.Item = {
  init: function({ id, type, x, y, InventoryId, ChunkId }) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.InventoryId = InventoryId;
    this.ChunkId = ChunkId;
  },
};
