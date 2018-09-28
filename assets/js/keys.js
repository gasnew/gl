const buildActionBase = actionName => ({
  callbacks: [],
  subscribe: callback => game.keys.actions[actionName].callbacks.push(callback),
  onDown: () => game.keys.dispatch(game.keys.actions[actionName].callbacks),
  isDown: false,
});

game.keys = {
  bindings: {
    moveLeft: 'A',
    moveRight: 'D',
    moveUp: 'W',
    moveDown: 'S',
    rotateLeft: 'Q',
    rotateRight: 'E',
  },

  names: {
    A: 65,
    D: 68,
    E: 69,
    F: 70,
    Q: 81,
    S: 83,
    W: 87,
  },

  bind: () => {
    window.addEventListener('keydown', game.keys.onKeydown, false);
    window.addEventListener('keyup', game.keys.onKeyup, false);
  },

  onKeydown: event => {
    game.keys.mapCodeToActionNames(event.keyCode).forEach(actionName => {
      const action = game.keys.actions[actionName];
      if (!action.isDown) {
        action.isDown = true;
        action.onDown();
      }
    });
  },

  onKeyup: event => {
    game.keys.mapCodeToActionNames(event.keyCode).forEach(actionName => {
      const action = game.keys.actions[actionName];
      action.isDown = false;
    });
  },

  mapCodeToActionNames: keyCode =>
    Object.keys(game.keys.bindings).filter(
      bindingName =>
        game.keys.names[game.keys.bindings[bindingName]] === keyCode
    ),

  dispatch: callbacks => callbacks.forEach(callback => callback()),

  thing: () => 5,
  actions: [
    'rotateLeft',
    'rotateRight',
    'moveLeft',
    'moveRight',
    'moveUp',
    'moveDown',
  ].reduce(
    (actions, actionName) => ({
      ...actions,
      [actionName]: buildActionBase(actionName),
    }),
    {}
  ),
};
