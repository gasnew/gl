game.draw = {
  DRAW_SCALE: 2,
  TILE_SIZE: 16,

  ModelToObjectsMap: {
    Tile: 'tiles',
    Facade: 'facades',
    Fixture: 'billboards',
    Player: 'billboards',
  },

  addParamsQueue: [], // A queue of parameters for adding new DisplayObjects

  init: function() {
    const landContainer = new PIXI.Container();

    const chunk = game.phase.index.Chunk[1];
    const fixtureAssets = Object.values(game.phase.index.Fixture);

    const filters = {
      facades: [0, 1, 2, 3].map(() => new PIXI.filters.ColorMatrixFilter()),
    };

    this.landContainer = landContainer;
    this.objects = Object.values(this.ModelToObjectsMap).reduce(
      (objects, object) => ({
        ...objects,
        [object]: [],
      }),
      {}
    );

    const { height, width } = chunk;

    // Add Tiles
    chunk.tiles
      .map(row => row.map(asset => this.add({ modelName: 'Tile', asset })))
      .flat();

    // Add Facades
    chunk.tiles
      .map(row =>
        row.map(asset =>
          [0, 1, 2, 3].map(edgeNumber =>
            this.add({
              modelName: 'Facade',
              asset,
              extraOptions: {
                edgeNumber,
                filter: filters.facades[edgeNumber],
                isExposed: game.draw.Facade.isExposed({
                  asset,
                  edgeNumber,
                  height,
                  width,
                }),
              },
            })
          )
        )
      )
      .flat(2);

    // Add Fixtures
    fixtureAssets.map(asset => this.add({ modelName: 'Fixture', asset }));

    landContainer.height *= this.DRAW_SCALE;
    landContainer.width *= this.DRAW_SCALE;
    landContainer.x = screen.width / 4;
    landContainer.y = screen.height / 2.5;
    landContainer.pivot.x = (this.TILE_SIZE * width) / 2;
    landContainer.pivot.y = (this.TILE_SIZE * height) / 2;

    this.filters = filters;

    return landContainer;
  },

  add: function({
    modelName,
    asset,
    extraOptions,
    container = game.draw.landContainer,
  }) {
    const displayObject = game.draw[modelName]({ asset, ...extraOptions });

    container.addChild(displayObject);

    const object = {
      displayObject,
      asset,
      extraOptions,
      container,
    };
    this.objects[this.ModelToObjectsMap[modelName]].push(object);

    return object;
  },

  queueAdd: function(addParams) {
    this.addParamsQueue.push(addParams);
  },

  update: function(delta, rotation) {
    this.addParamsQueue.forEach(addParams => this.add(addParams));
    this.addParamsQueue.length = 0;

    const landContainer = this.landContainer;
    const { facades, billboards } = this.objects;

    //landContainer.children.sort(
    //(spriteA, spriteB) => spriteA.y - spriteB.y
    //);
    this.updateFacades({ facades, rotation, filters: this.filters.facades });
    this.updateBillboards({ billboards, rotation });

    landContainer.rotation = rotation;
  },

  updateFacades: function({ facades, rotation, filters }) {
    for (let edgeNumber = 0; edgeNumber < 4; edgeNumber++) {
      // Color
      let offsetAngle = null;
      let limitedAngle = null;
      if (rotation >= 0) {
        offsetAngle = rotation + (5 * Math.PI) / 2;
        limitedAngle =
          (offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI);
      } else {
        offsetAngle = rotation - (3 * Math.PI) / 2;
        limitedAngle =
          2 * Math.PI +
          ((offsetAngle - (edgeNumber * Math.PI) / 2) % (2 * Math.PI));
      }
      filters[edgeNumber].brightness((limitedAngle + Math.PI / 2) / Math.PI);

      // Skew
      for (const facade of facades.filter(
        facade =>
          facade.extraOptions.isExposed &&
          facade.extraOptions.edgeNumber === edgeNumber
      )) {
        const { displayObject } = facade;
        if (limitedAngle > Math.PI) {
          displayObject.renderable = false;
          continue;
        } else if (displayObject.renderable === false)
          displayObject.renderable = true;

        displayObject.rotation = -rotation;
        displayObject.skew.set(0.0, limitedAngle - Math.PI / 2);
      }
    }
  },

  updateBillboards: function({ billboards, rotation }) {
    for (const billboard of billboards) {
      const { displayObject, asset } = billboard;
      displayObject.position.set((asset.x + 0.5) * 16, (asset.y + 0.5) * 16);
      displayObject.rotation = -rotation;
    }
  },
};
