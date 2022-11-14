/* eslint-disable */
const { format: formatDate } = require("date-fns");
const consts = require("../common/consts");
const ApiError = require("../common/api-error");
const { Task, User } = require("../models");

class TaskService {
  async create(data, user) {
    const validation = this.validateTask(data);
    if (!validation.valid) {
      throw new ApiError(validation.message, 412);
    }

    const { title, summary } = data;
    let { performerId } = data;

    if (user.role === consts.USER_ROLE.TECHNICIAN) {
      performerId = user.id;
    }

    const task = {
      title,
      summary: this.encodeSummary(summary),
      creator_id: user.id,
      performer_id: performerId,
    };

    return Task.create(task);
  }

  async update(taskId, data, user) {
    const validation = this.validateTask(data);
    if (!validation.valid) {
      throw new ApiError(validation.message, 412);
    }

    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    const taskJson = task.toJSON();
    const { title, summary, performerId } = data;

    if (!this.canUpdateTask(user, taskJson)) {
      throw new ApiError("Unauthorized", 401);
    }

    task.set({
      title,
      summary: this.encodeSummary(summary),
      updated: new Date(),
      performer_id: performerId,
    });
    await task.save();
    return task.toJSON();
  }

  async list(user) {
    const where = {};

    if (user.role === consts.USER_ROLE.TECHNICIAN) {
      where.performer_id = user.id;
    }

    return Task.findAll({ where, raw: true, order: [["created", "DESC"]] });
  }

  async getOne(taskId, user) {
    const where = { id: taskId };

    if (user.role === consts.USER_ROLE.TECHNICIAN) {
      where.performer_id = user.id;
    }

    const task = await Task.findOne({ where, raw: true });
    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    return task;
  }

  async delete(taskId, user) {
    if (user.role !== consts.USER_ROLE.MANAGER) {
      throw new ApiError("Unauthorized", 401);
    }

    return Task.destroy({ where: { id: taskId } });
  }

  async perform(taskId, user) {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: User,
          as: "Performer",
        },
      ],
    });

    if (!task) {
      throw new ApiError("Task not found", 404);
    }

    if (!this.canUpdateTask(user, task.toJSON())) {
      throw new ApiError("Unauthorized", 401);
    }

    const currentDate = new Date();
    task.set({ updated: currentDate, performed_at: currentDate });
    await task.save();
    const output = task.toJSON();

    // eslint-disable-next-line no-console
    console.info(
      `===== The Tech ${output.Performer.name} performed the Task ${
        task.title
      } on date ${formatDate(currentDate, "yyyy-MM-dd HH:mm:ss")} =====`
    );

    return output;
  }

  encodeSummary(summary) {
    return Buffer.from(summary).toString("base64");
  }

  canUpdateTask(user, task) {
    return (
      user.role === consts.USER_ROLE.MANAGER ||
      (user.role === consts.USER_ROLE.TECHNICIAN &&
        task.performer_id === user.id)
    );
  }

  validateTask(data) {
    const requiredAttrs = ["title", "summary", "performerId"];
    const missingAttrs = [];

    for (let x = 0; x < requiredAttrs.length; x += 1) {
      if (!data[requiredAttrs[x]]) {
        missingAttrs.push(requiredAttrs[x]);
      }
    }

    let msg = "";

    if (missingAttrs.length) {
      msg = `Please fill all the required attributes: ${missingAttrs.join(
        ","
      )}`;
    }

    return { valid: !msg.length, message: msg };
  }
}

module.exports = TaskService;
