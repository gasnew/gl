module.exports = {
  development: {
    username: "root",
    password: "mysql_password",
    database: "gl_test",
    host: "localhost",
    dialect: "mysql",

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

