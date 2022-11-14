const config = require("../config");
const fs = require("fs");

const options = {
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  host: config.db.host,
  port: config.db.port,
  dialect: "mysql",
};

module.exports = {
  development: { ...options },
  test: { ...options },
  staging: { ...options },
  production: { ...options },
};
