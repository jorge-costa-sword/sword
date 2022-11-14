const { Sequelize } = require("sequelize");
const config = require("../../config");

const options = {
  host: config.db.host,
  port: config.db.port,
  dialect: "mysql",
  logging: false,
};

const database = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  options
);

module.exports = { database };
