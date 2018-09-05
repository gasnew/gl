game.Utils = {
  create: function(modelName, params) {
    const asset = Object.create(game[modelName]);
    asset.init(params);
    return asset;
  },

  arrange: function({ items, numRows, numColumns, getRow, getColumn }) {
    let rows = Array(numRows);
    for (let r = 0; r < numRows; r++) {
      rows[r] = Array(numColumns);
      for (let c = 0; c < numColumns; c++) {
        rows[r][c] = items.find(
          item => getRow(item) === r && getColumn(item) === c
        );
      }
    }

    return rows;
  },
};
