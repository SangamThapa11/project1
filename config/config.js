const { PgConfig } = require("../src/config/config");

module.exports = {
  "development": {
    "username": PgConfig.user,
    "password": PgConfig.password,
    "database":PgConfig.dbName,
    "host": PgConfig.host,
    "dialect": `${PgConfig.dialect}`
  },
  "test": {
    "username": PgConfig.user,
    "password": PgConfig.password,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": `${PgConfig.dialect}`
  },
  "production": {
    "username": PgConfig.user,
    "password": PgConfig.password,
    "database": PgConfig.dbName,
    "host": PgConfig.host,
    "dialect": `${PgConfig.dialect}`
  }
}