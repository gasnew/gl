game.Net.State = {
  getPhaseState: function() {
    return new Promise(async resolve => {
      const phaseState = await game.Net.get('phases/state');

      console.log(phaseState);
      resolve(phaseState);
    });
  },
};
