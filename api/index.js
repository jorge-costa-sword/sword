const createError = require("http-errors");
const express = require("express");

const logger = require("morgan");

const config = require("./config");
const ErrorMiddleware = require("./src/middlewares/error");

if (config.env !== "test") {
  // eslint-disable-next-line global-require
  require("./src/queue/consumer");
}

const indexRouter = require("./src/routes/index");
const userRouter = require("./src/routes/user");
const taskRouter = require("./src/routes/task");

const app = express();

app.use(logger("dev"));
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization,X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(indexRouter);
app.use(userRouter);
app.use(taskRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(ErrorMiddleware);

const server = app.listen(config.api.port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log("Server listening on ", config.api.port);
});

module.exports = server;
