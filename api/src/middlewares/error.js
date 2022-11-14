/* eslint-disable */
const Status = require("http-status");
const ApiError = require("../common/api-error");

module.exports = async (error, req, res, next) => {
  if (error instanceof ApiError || error.name === "ApiError") {
    const { message, status, stack, data } = error;
    err = {
      name: "Api Error",
      status,
      message,
      stack,
      data,
      dateTime: new Date(),
    };
  } else {
    const { name, status, message, stack, errors } = error;
    err = {
      name,
      status,
      message,
      stack,
      data: errors,
      dateTime: new Date(),
    };
  }

  const status = err.status || 500;

  res.status(status).json({
    type: `https://httpstatuses.com/${status}`,
    title: Status[status],
    status,
    detail: err.message || err.errors,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
