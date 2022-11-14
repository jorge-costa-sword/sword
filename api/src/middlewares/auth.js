const jwt = require("jwt-simple");

const config = require("../../config");

const throwUnauthorized = (next) => {
  next({
    status: 401,
    error: "Unauthorized",
  });
};

module.exports = (req, res, next) => {
  let token;
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    [, token] = bearer;
    req.token = token;
  }

  if (token) {
    let decoded = null;

    try {
      decoded = jwt.decode(token, config.api.secretKey);

      if (decoded) {
        req.user = decoded;
        next();
      }
    } catch (ex) {
      throwUnauthorized(next);
    }
  } else {
    throwUnauthorized(next);
  }
};
