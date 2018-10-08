game.draw.Tile = ({ asset }) => {
  const tileTexture = PIXI.Texture.fromImage('../../textures/defaultSmall.jpg');

  const tile = new PIXI.Sprite(tileTexture);
  tile.x = asset.x * 16;
  tile.y = asset.y * 16;

  return tile;
};

game.draw.Facade = ({ asset, edgeNumber, filter }) => {
  const facadeTexture = PIXI.Texture.fromImage('../../textures/dirtLong.png');

  const edges = [
    {
      // Bottom edge
      offset: { x: 0, y: 16 / 2 },
    },
    {
      // Right edge
      offset: { x: 16 / 2, y: -16 / 2 },
    },
    {
      // Top edge
      offset: { x: 0, y: -16 / 2 },
    },
    {
      // Left edge
      offset: { x: -16 / 2, y: -16 / 2 },
    },
  ];
  const facade = new PIXI.Sprite(facadeTexture);
  const edge = edges[edgeNumber];
  facade.x = asset.x * 16 + 16 / 2 + edge.offset.x;
  facade.y = asset.y * 16 + 16 / 2 + edge.offset.y;
  facade.pivot.x = 16 / 2 + edge.offset.x;
  facade.pivot.y = 0;

  facade.filters = [filter];
  facade.renderable = false;

  return facade;
};

game.draw.Fixture = ({ asset }) => {
  const texture = PIXI.Texture.fromImage('../../textures/bush.jpg');

  return game.draw.Billboard({
    asset,
    texture,
  });
};

game.draw.Player = ({ asset }) => {
  const texture = PIXI.Texture.fromImage('../../textures/man.png');

  return game.draw.Billboard({
    asset,
    texture,
    xPivot: 16 / 4,
  });
};

game.draw.Billboard = ({
  asset,
  texture,
  xPivot = 16 / 2,
}) => {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = (asset.x + 0.5) * 16;
  sprite.y = (asset.y + 0.5) * 16;
  sprite.pivot.y = 16 * 0.75;
  sprite.pivot.x = xPivot;

  return sprite;
};

const specialCharacters = {
  '.': 'period',
  '!': 'exclamation',
  '?': 'question',
  '[': 'bracket_left',
  ']': 'bracket_right',
};
const mapCharacterToSpriteName = character => {
  if (character in specialCharacters) return specialCharacters[character];
  else if (character === character.toUpperCase()) return character;
  else if (character === character.toLowerCase()) return `${character}_lower`;
  else return 'question';
};

game.draw.Text = ({ text, addChild, addFilter = () => {} }) => {
  const textContainer = new PIXI.Container();

  text.split('').forEach(character => {
    const sprite = new PIXI.Sprite(
      game.font.textures[`${mapCharacterToSpriteName(character)}.png`]
    );
    sprite.x = textContainer.width + (textContainer.width ? 2 : 0);
    textContainer.addChild(sprite);
    return sprite;
  });

  addFilter(textContainer);
  addChild(textContainer);

  return textContainer;
};
