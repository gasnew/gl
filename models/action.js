module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    type: DataTypes.STRING,
    content: DataTypes.JSON,
    newRecords: DataTypes.JSON,
  });

  Action.associate = function(models) {
    Action.belongsTo(models.Phase);
    Action.belongsTo(models.Player);
  };

  return Action;
};
