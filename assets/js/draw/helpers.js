game.draw.Facade.isExposed = ({ asset, edgeNumber, height, width }) => {
  return (
    (asset.y === height - 1 && edgeNumber === 0) ||
    (asset.x === width - 1 && edgeNumber === 1) ||
    (asset.y === 0 && edgeNumber === 2) ||
    (asset.x === 0 && edgeNumber === 3)
  );
};
