game.controls = {
  init: function() {
    const player = game.entities.getMainPlayer();
    const directions = {
      moveLeft: () =>
        game.controls.getPositionByCameraRotation(player, -Math.PI / 2),
      moveRight: () =>
        game.controls.getPositionByCameraRotation(player, Math.PI / 2),
      moveUp: () => game.controls.getPositionByCameraRotation(player, Math.PI),
      moveDown: () => game.controls.getPositionByCameraRotation(player, 0),
    };
    for (const direction of Object.keys(directions)) {
      game.keys.actions[direction].subscribe(() =>
        player.moveTo(game.chunk.tileAt(directions[direction]()))
      );
    }

    game.keys.actions.rotateLeft.subscribe(() => game.camera.rotateLeft());
    game.keys.actions.rotateRight.subscribe(() => game.camera.rotateRight());
  },

  getPositionByCameraRotation: function(entity, rotation) {
    return {
      row:
        entity.y + Math.cos((game.camera.targetEdge * Math.PI) / 2 + rotation),
      col:
        entity.x + Math.sin((game.camera.targetEdge * Math.PI) / 2 + rotation),
    };
  },
};
