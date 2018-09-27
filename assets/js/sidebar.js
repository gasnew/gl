game.sidebar = {
  init: function() {
    const controlsContainer = new PIXI.Container();

    const addChild = sprite => controlsContainer.addChild(sprite);
    const objects = {
      bindings: Object.keys(game.keys.bindings).map(actionName =>
        game.sidebar.Binding({
          actionName,
          key: game.keys.bindings[actionName],
          addChild,
        })
      ),
    };

    this.objects = objects;

    return controlsContainer;
  },

  update: function() {
  },
};

game.sidebar.Binding = ({ actionName, key, addChild }) => {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = (billboard.x + 0.5) * 16;
  sprite.y = (billboard.y + 0.5) * 16;

  addChild(sprite);

  const onDown = () => console.log(actionName);

  game.keys[actionName].subscribe(onDown);

  return {
    sprites: {
      key: keySprite,
      action: actionSprite,
    },
    onDown,
  };
};
