const ampqlib = require("amqplib");
const config = require("../../config");

const connect = () => {
  // eslint-disable-next-line max-len
  return ampqlib
    .connect(
      `amqp://${config.notificationsQueue.user}:${config.notificationsQueue.password}@${config.notificationsQueue.host}`
    )
    .then((conn) => conn.createChannel());
};

const createQueue = (channel, queue) => {
  return new Promise((resolve, reject) => {
    try {
      channel.assertQueue(queue, { durable: true });
      resolve(channel);
    } catch (err) {
      reject(err);
    }
  });
};

const sendToQueue = (queue, message) => {
  connect()
    .then((channel) => createQueue(channel, queue))
    .then((channel) =>
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
    );
};

const consume = (queue, callback) => {
  connect()
    .then((channel) => createQueue(channel, queue))
    .then((channel) => channel.consume(queue, callback, { noAck: true }));
};

module.exports = {
  sendToQueue,
  consume,
};
