module.exports = function(sequelize, DataTypes) {
  var Chunk = sequelize.define('Chunk', {
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
  });

  Chunk.associate = function(models) {
    Chunk.hasMany(models.Item);
  };

  return Chunk;
};

