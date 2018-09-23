//THE START OF MY GAME SO EXCITING

(() => {
  //Create a Pixi Application
  const pixi = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
  });
  window.addEventListener('resize', function() {
    pixi.renderer.resize(window.innerWidth, window.innerHeight);
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(pixi.view);

  // GET CURRENT PHASE STATE
  game.Net.State.getPhaseState().then(phaseState => {
    const phase = Object.create(game.Phase);
    phase.init({ state: phaseState });

    game.beginPhase(pixi.stage, phase);

    pixi.ticker.add(game.update);
  });
})();
