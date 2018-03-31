module.exports = {
  development: {
    username: 'root',
    password: 'mysql_password',
    database: 'database_name',
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

