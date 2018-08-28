module.exports = {
  development: {
    username: 'root',
    password: 'do_not_use_root_please',
    database: 'gl',
    host: 'mysql',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

