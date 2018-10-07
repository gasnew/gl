game.sidebar = {
  init: function() {
    const controlsContainer = new PIXI.Container();
    const whiteFilter = new PIXI.filters.ColorMatrixFilter();

    const addChild = sprite => controlsContainer.addChild(sprite);
    const addFilter = sprite => (sprite.filters = [whiteFilter]);
    const objects = {
      bindings: Object.keys(game.keys.bindings).map(actionName => {
        const binding = game.sidebar.Binding({
          actionName,
          key: game.keys.bindings[actionName],
          y: controlsContainer.height + (controlsContainer.height ? 4 : 0),
          addChild,
          addFilter,
        });
        game.keys.actions[actionName].subscribe('onDown', binding.onDown);
        game.keys.actions[actionName].subscribe('onUp', binding.onUp);
      }),
    };

    whiteFilter.negative();
    controlsContainer.x = screen.width * 0.45;
    controlsContainer.y = screen.height / 4;
    controlsContainer.scale.set(4);

    this.objects = objects;

    return controlsContainer;
  },
};

game.sidebar.Binding = ({ actionName, key, y, addChild, addFilter }) => {
  const keyObjectBottom = game.draw.Text({ text: `[${key}]`, addChild });
  const keyObjectTop = game.draw.Text({
    text: `[${key}]`,
    addChild,
    addFilter,
  });
  const actionObject = game.draw.Text({
    text: actionName.toUpperCase(),
    addChild,
    addFilter,
  });

  keyObjectBottom.y = y;
  keyObjectTop.y = y - 1;
  keyObjectTop.x -= 1;
  actionObject.x = keyObjectBottom.x + keyObjectBottom.width + 4;
  actionObject.y = y;

  const upPosition = keyObjectTop.position.clone();
  const onDown = () => (keyObjectTop.position = keyObjectBottom.position);
  const onUp = () => (keyObjectTop.position = upPosition);

  return {
    objects: {
      keyBottom: keyObjectBottom,
      keyTop: keyObjectTop,
      action: actionObject,
    },
    actionName,
    onDown,
    onUp,
  };
};
