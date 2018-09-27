game.draw = {
  DRAW_SCALE: 2,
  TILE_SIZE: 16,

  init: function() {
    const landContainer = new PIXI.Container();

    const chunk = game.phase.index.Chunk[1];
    const fixtures = Object.values(game.phase.index.Fixture);
    const players = Object.values(game.phase.index.Player);

    const filters = {
      piles: [0, 1, 2, 3].map(() => new PIXI.filters.ColorMatrixFilter()),
    };

    const { height, width } = chunk;
    const addChild = sprite => landContainer.addChild(sprite);
    const sprites = {
      land: game.draw.Land({ height, width, addChild }),
      piles: game.draw.Piles({
        height,
        width,
        addChild,
        addFilter: (sprite, edgeNumber) =>
          (sprite.filters = [filters.piles[edgeNumber]]),
      }),
      billboards: game.draw
        .Fixtures({ fixtures, addChild })
        .concat(game.draw.Players({ players, addChild })),
    };
    const sprite = game.draw.Text({ text: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG?!?', addChild});

    landContainer.height *= this.DRAW_SCALE;
    landContainer.width *= this.DRAW_SCALE;
    landContainer.x = screen.width / 4;
    landContainer.y = screen.height / 2.5;
    landContainer.pivot.x = (this.TILE_SIZE * width) / 2;
    landContainer.pivot.y = (this.TILE_SIZE * height) / 2;

    this.landContainer = landContainer;
    this.filters = filters;
    this.sprites = sprites;

    return landContainer;
  },

  update: function(delta, rotation) {
    const landContainer = this.landContainer;
    const { piles, billboards } = this.sprites;

    //landContainer.children.sort(
    //(spriteA, spriteB) => spriteA.y - spriteB.y
    //);
    for (let edgeNumber = 0; edgeNumber < 4; edgeNumber++) {
      // Color
      let offsetAngle = null;
      let limitedAngle = null;
      if (rotation >= 0) {
        offsetAngle = rotation + (5 * Math.PI) / 2;
        limitedAngle =
          (offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI);
      } else {
        offsetAngle = rotation - (3 * Math.PI) / 2;
        limitedAngle =
          2 * Math.PI +
          ((offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI));
      }
      this.filters.piles[edgeNumber].brightness(
        (limitedAngle + Math.PI / 2) / Math.PI
      );

      // Skew
      for (const pile of piles[edgeNumber]) {
        if (limitedAngle > Math.PI) {
          pile.renderable = false;
          continue;
        } else if (pile.renderable === false) pile.renderable = true;

        pile.rotation = -rotation;
        pile.skew.set(0.0, limitedAngle - Math.PI / 2);
      }
    }

    for (const billboard of billboards) {
      billboard.rotation = -rotation;
    }

    landContainer.rotation = rotation;
  },
};
