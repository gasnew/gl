game.draw = {
  DRAW_SCALE: 2,
  TILE_SIZE: 16,

  init: function(stage) {
    this.landContainer = new PIXI.Container();
    const tileTexture = PIXI.Texture.fromImage(
      '../../textures/defaultSmall.jpg'
    );
    const pileTexture = PIXI.Texture.fromImage('../../textures/dirtLong.png');

    const chunk = game.phase.index.Chunk[1];
    const { height, width } = chunk;

    this.pileFilters = Array(4);
    for (let i = 0; i < 4; i++)
      this.pileFilters[i] = new PIXI.filters.ColorMatrixFilter();
    this.piles = Array(4);
    const edges = [
      {
        // Bottom edge
        getRow: () => height - 1,
        getColumn: position => position,
        offset: { x: 0, y: this.TILE_SIZE / 2 },
      },
      {
        // Right edge
        getRow: position => position,
        getColumn: () => width - 1,
        offset: { x: this.TILE_SIZE / 2, y: -this.TILE_SIZE / 2 },
      },
      {
        // Top edge
        getRow: () => 0,
        getColumn: position => position,
        offset: { x: 0, y: -this.TILE_SIZE / 2 },
      },
      {
        // Left edge
        getRow: position => position,
        getColumn: () => 0,
        offset: { x: -this.TILE_SIZE / 2, y: -this.TILE_SIZE / 2 },
      },
    ];
    for (let edgeNumber = 0; edgeNumber < 4; edgeNumber++) {
      this.piles[edgeNumber] = Array(width);
      for (let position = 0; position < width; position++) {
        const pile = new PIXI.Sprite(pileTexture);
        const edge = edges[edgeNumber];
        pile.x =
          edge.getColumn(position) * this.TILE_SIZE +
          this.TILE_SIZE / 2 +
          edge.offset.x;
        pile.y =
          edge.getRow(position) * this.TILE_SIZE +
          this.TILE_SIZE / 2 +
          edge.offset.y;
        pile.pivot.x = this.TILE_SIZE / 2 + edge.offset.x;
        pile.pivot.y = 0;

        pile.filters = [this.pileFilters[edgeNumber]];
        this.landContainer.addChild(pile);

        this.piles[edgeNumber][position] = pile;
      }
    }
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const tile = new PIXI.Sprite(tileTexture);
        tile.x = column * this.TILE_SIZE;
        tile.y = row * this.TILE_SIZE;
        this.landContainer.addChild(tile);
      }
    }

    this.landContainer.height *= this.DRAW_SCALE;
    this.landContainer.width *= this.DRAW_SCALE;
    this.landContainer.x = screen.width / 4;
    this.landContainer.y = screen.height / 2.5;
    this.landContainer.pivot.x = (this.TILE_SIZE * width) / 2;
    this.landContainer.pivot.y = (this.TILE_SIZE * height) / 2;

    stage.addChild(this.landContainer);
  },

  update: function(delta) {
    this.landContainer.rotation -= 0.003 * delta;
    for (let edgeNumber = 0; edgeNumber < 4; edgeNumber++) {
      let offsetAngle = null;
      let limitedAngle = null;
      if (this.landContainer.rotation >= 0) {
        offsetAngle = this.landContainer.rotation + (5 * Math.PI) / 2;
        limitedAngle =
          (offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI);
      } else {
        offsetAngle = this.landContainer.rotation - (3 * Math.PI) / 2;
        limitedAngle =
          2 * Math.PI +
          ((offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI));
      }
      this.pileFilters[edgeNumber].brightness(
        (limitedAngle + Math.PI / 2) / Math.PI
      );

      for (const pile of this.piles[edgeNumber]) {
        if (limitedAngle > Math.PI) {
          pile.renderable = false;
          continue;
        } else if (pile.renderable === false) pile.renderable = true;

        pile.rotation = -this.landContainer.rotation;
        pile.skew.set(0.0, limitedAngle - Math.PI / 2);
      }
    }
  },
};
