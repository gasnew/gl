const buildActionBase = actionName => ({
  callbacks: [],
  subscribe: callback => game.keys.actions[actionName].callbacks.push(callback),
  onDown: () => game.keys.dispatch(game.keys.actions[actionName].callbacks),
  isDown: false,
});

game.keys = {
  bindings: {
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
  },

  onKeydown: event => {
    console.log(event.keyCode);
    const actionNames = Object.keys(game.keys.bindings).filter(
      bindingName =>
        game.keys.names[game.keys.bindings[bindingName]] === event.keyCode
    );
    actionNames.forEach(actionName => game.keys.actions[actionName].onDown());
  },

  dispatch: callbacks => callbacks.forEach(callback => callback()),

  thing: () => 5,
  actions: ['rotateLeft', 'rotateRight'].reduce(
    (actions, actionName) => ({
      ...actions,
      [actionName]: buildActionBase(actionName),
    }),
    {}
  ),
};
