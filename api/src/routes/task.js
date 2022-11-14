const express = require("express");

const router = express.Router();

const config = require("../../config");
const TaskService = require("../services/task");

const taskService = new TaskService();
const auth = require("../middlewares/auth");
const queue = require("../queue/queue");

router.post("/task", auth, async (req, res, next) => {
  const { user, body } = req;

  try {
    const resp = await taskService.create(body, user);
    res.status(201).send(resp);
  } catch (err) {
    next(err);
  }
});

router.get("/task", auth, async (req, res, next) => {
  const { user } = req;

  try {
    const resp = await taskService.list(user);
    res.status(200).send(resp);
  } catch (err) {
    next(err);
  }
});

router.get("/task/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    const resp = await taskService.getOne(id, user);
    res.status(200).send(resp);
  } catch (err) {
    next(err);
  }
});

router.put("/task/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { user, body } = req;

  try {
    const resp = await taskService.update(id, body, user);
    res.status(200).send(resp);
  } catch (err) {
    next(err);
  }
});

router.put("/task/:id/perform", auth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  queue.sendToQueue(config.notificationsQueue.name, {
    taskId: id,
    user,
  });
  res.status(200).send({ ok: true });
});

router.delete("/task/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    await taskService.delete(id, user);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
