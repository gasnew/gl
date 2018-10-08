module.exports = function(sequelize, DataTypes) {
  var Fixture = sequelize.define('Fixture', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Fixture.associate = function(models) {
    Fixture.belongsTo(models.Chunk);
  };

  return Fixture;
};

