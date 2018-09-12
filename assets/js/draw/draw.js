game.draw = {
  TILE_SIZE: 16,

  init: function(stage) {
    this.chunkContainer = new PIXI.Container();
    stage.addChild(this.chunkContainer);
    var texture = PIXI.Texture.fromImage('../../textures/default-small.jpg');

    const chunk = game.phase.index.Chunk[1];
    const { height, width } = chunk;
    for (let row = 0; row < height / 2; row++) {
      for (let column = 0; column < width / 2; column++) {
        const tile = new PIXI.Sprite(texture);
        tile.anchor.set(0.5);
        tile.x = column * this.TILE_SIZE;
        tile.y = row * this.TILE_SIZE;
        this.chunkContainer.addChild(tile);
      }
    }

    // Move this.chunkContainer to the center
    this.chunkContainer.height = this.chunkContainer.height * 2;
    this.chunkContainer.width = this.chunkContainer.width * 2;
    this.chunkContainer.x = screen.width / 2;
    this.chunkContainer.y = screen.height / 2;

    // Center bunny sprite in local this.chunkContainer coordinates
    this.chunkContainer.pivot.x = this.chunkContainer.width / 4;
    this.chunkContainer.pivot.y = this.chunkContainer.height / 4;
  },

  update: function(delta) {
    this.chunkContainer.rotation -= 0.003 * delta;
  },
};
