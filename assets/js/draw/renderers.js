game.draw.Land = ({ height, width, addChild }) => {
  const tileTexture = PIXI.Texture.fromImage('../../textures/defaultSmall.jpg');

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const tile = new PIXI.Sprite(tileTexture);
      tile.x = column * 16;
      tile.y = row * 16;
      addChild(tile);
    }
  }
};

game.draw.Piles = ({ height, width, addChild, addFilter }) => {
  const pileTexture = PIXI.Texture.fromImage('../../textures/dirtLong.png');

  const piles = Array(4);
  const edges = [
    {
      // Bottom edge
      getRow: () => height - 1,
      getColumn: position => position,
      offset: { x: 0, y: 16 / 2 },
    },
    {
      // Right edge
      getRow: position => position,
      getColumn: () => width - 1,
      offset: { x: 16 / 2, y: -16 / 2 },
    },
    {
      // Top edge
      getRow: () => 0,
      getColumn: position => position,
      offset: { x: 0, y: -16 / 2 },
    },
    {
      // Left edge
      getRow: position => position,
      getColumn: () => 0,
      offset: { x: -16 / 2, y: -16 / 2 },
    },
  ];
  for (let edgeNumber = 0; edgeNumber < 4; edgeNumber++) {
    piles[edgeNumber] = Array(width);
    for (let position = 0; position < width; position++) {
      const pile = new PIXI.Sprite(pileTexture);
      const edge = edges[edgeNumber];
      pile.x = edge.getColumn(position) * 16 + 16 / 2 + edge.offset.x;
      pile.y = edge.getRow(position) * 16 + 16 / 2 + edge.offset.y;
      pile.pivot.x = 16 / 2 + edge.offset.x;
      pile.pivot.y = 0;

      addFilter(pile, edgeNumber);
      addChild(pile);

      piles[edgeNumber][position] = pile;
    }
  }

  return piles;
};

game.draw.Fixtures = ({ fixtures, addChild }) => {
  const texture = PIXI.Texture.fromImage('../../textures/bush.jpg');

  return game.draw.Billboards({ billboards: fixtures, texture, addChild });
};

game.draw.Players = ({ players, addChild }) => {
  const texture = PIXI.Texture.fromImage('../../textures/man.png');

  return game.draw.Billboards({
    billboards: players,
    texture,
    addChild,
    xPivot: 16 / 4,
  });
};

game.draw.Billboards = ({ billboards, texture, addChild, xPivot = 16 / 2 }) => {
  return billboards.map(billboard => {
    const sprite = new PIXI.Sprite(texture);
    sprite.x = (billboard.x + 0.5) * 16;
    sprite.y = (billboard.y + 0.5) * 16;
    sprite.pivot.y = 16 * 0.75;
    sprite.pivot.x = xPivot;

    addChild(sprite);

    return sprite;
  });
};
