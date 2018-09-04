//THE START OF MY GAME SO EXCITING

(() => {
  // GET CURRENT PHASE STATE
  game.Net.State.getPhaseState().then(phaseState => {
    const phase = Object.create(game.Phase);
    phase.init({ state: phaseState });

    game.beginPhase(phase);

    window.setInterval(function() {
      game.update();
    }, 16.7);
  });
})();

