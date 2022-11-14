const queue = require("./queue");
const config = require("../../config");
const TaskService = require("../services/task");

const taskService = new TaskService();

queue.consume(config.notificationsQueue.name, async (message) => {
  const content = JSON.parse(message.content);
  const { user, taskId } = content;
  await taskService.perform(taskId, user);
});
