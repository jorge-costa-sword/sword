const path = require("path");

module.exports = {
  api: {
    port: process.env.PORT || 3000,
    secretKey: process.env.SECRET_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  notificationsQueue: {
    name: process.env.NOTIFICATIONS_QUEUE_NAME,
    user: process.env.NOTIFICATIONS_QUEUE_USER,
    password: process.env.NOTIFICATIONS_QUEUE_PASSWORD,
    host: process.env.NOTIFICATIONS_QUEUE_HOST,
  },
};
