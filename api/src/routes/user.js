const express = require("express");

const router = express.Router();
const UserService = require("../services/user");

const userService = new UserService();

router.post("/user/register", async (req, res, next) => {
  const { body } = req;

  try {
    const resp = await userService.register(body);
    res.status(201).send(resp);
  } catch (err) {
    next(err);
  }
});

router.post("/user/login", async (req, res, next) => {
  try {
    const resp = await userService.login(req.body.email, req.body.password);
    res.status(200).send(resp);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
