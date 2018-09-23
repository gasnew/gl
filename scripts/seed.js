var models = require('../models');

(async function() {
  await models.sequelize.sync({ force: true });

  const HEIGHT = 15;
  const WIDTH = 15;

  await models.Chunk.create({ height: HEIGHT, width: WIDTH });

  const snapshotIndex = await models.Phase.getSnapshotIndex();
  await models.Phase.create({ status: 'active', snapshotIndex });

  console.log('ALL DONE!!');
  process.exit();
})();
