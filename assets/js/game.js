var game = {
  init : () => {
    game.land.init(50, 50);
    game.entities.init(game.land);
    game.hud.init(game.land, game.entities, game.draw.canvas.cursor);
    game.draw.init();
  },

  update : () => {
    game.draw.reset();

    game.hud.update();

    game.draw.land(game.land.blocks);
    game.draw.entities.player(game.entities.player);
  },
};

