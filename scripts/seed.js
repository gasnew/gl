var models = require('../models');

(async function() {
  await models.sequelize.sync({ force: true });

  const HEIGHT = 15;
  const WIDTH = 15;

  const chunk = await models.Chunk.create({ height: HEIGHT, width: WIDTH });
  const locations = [
    [5, 10],
    [6, 10],
    [6, 11],
    [7, 11],
    [7, 10],
    [10, 10],
    [10, 9],
    [10, 11]
  ];
  for (const location of locations)
    await chunk.createFixture({ type: 'bush', x: location[0], y: location[1] });

  const snapshotIndex = await models.Phase.getSnapshotIndex();
  await models.Phase.create({ status: 'active', snapshotIndex });

  console.log('ALL DONE!!');
  process.exit();
})();
