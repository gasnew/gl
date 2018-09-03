var models = require('../models');

(async function() {
  await models.sequelize.sync({force: true});

  await models.Phase.create({status: 'active'});

  const HEIGHT = 25;
  const WIDTH = 25;

  var chunk = await models.Chunk.create({height: HEIGHT, width: WIDTH});
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      await chunk.createTile({x: x, y: y});
    }
  }

  console.log('ALL DONE!!');
  process.exit();
})();

