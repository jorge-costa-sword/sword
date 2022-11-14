// require("dotenv").config({ path: "./.env.test" });
// require("dotenv").config();
const path = require("path");

module.exports = {
  api: {
    port: process.env.TEST_PORT || 5000,
    secretKey: process.env.TEST_SECRET_KEY,
  },
  db: {
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    port: process.env.TEST_DB_PORT,
  },
  notificationsQueue: {
    name: process.env.TEST_NOTIFICATIONS_QUEUE_NAME,
    user: process.env.TEST_NOTIFICATIONS_QUEUE_USER,
    password: process.env.TEST_NOTIFICATIONS_QUEUE_PASSWORD,
    host: process.env.TEST_NOTIFICATIONS_QUEUE_HOST,
  },
};
