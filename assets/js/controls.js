game.controls = {
  init: function() {
    const player = game.entities.getMainPlayer();
    const directions = {
      moveLeft: () => ({ row: player.y, col: player.x - 1 }),
      moveRight: () => ({ row: player.y, col: player.x + 1 }),
      moveUp: () => ({ row: player.y - 1, col: player.x }),
      moveDown: () => ({ row: player.y + 1, col: player.x }),
    };
    for (const direction of Object.keys(directions)) {
      game.keys.actions[direction].subscribe(() => player.moveTo(
        game.chunk.tileAt(directions[direction]())));
    }
  },
};
