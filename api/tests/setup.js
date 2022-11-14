const { exec } = require("child_process");
const { database } = require("../src/db");
const api = require("../index");

const runMigrations = async () => {
  return new Promise((resolve, reject) => {
    const migrate = exec(
      "NODE_ENV=test sequelize-cli db:migrate --debug",
      { env: process.env },
      err => (err ? reject(err): resolve())
    );

    migrate.stdout.pipe(process.stdout);
    migrate.stderr.pipe(process.stderr);
  });
}

beforeAll(async () => {
  await runMigrations();
});

afterAll(async () => {
  api.close();
  await database.query("DELETE FROM task");
  await database.query("DELETE FROM user");
});


module.exports = { api };