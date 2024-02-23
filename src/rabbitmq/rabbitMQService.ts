import * as amqp from 'amqplib';

const username = 'joker';
const password = 'Joker@123$';
const host = '54.169.246.109';
const port = 5672; //# Default port for AMQP
const vhost = '/'; //# Default virtual host

const sendToQueue = async (queue: string, data: string): Promise<void> => {
  const amqp_url = `amqp://${username}:${password}@${host}:${port}${vhost}`;
  const connection = await amqp.connect(amqp_url); // Thay đổi URL này theo cấu hình RabbitMQ của bạn
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });
  await channel.sendToQueue(queue, Buffer.from(data));
  console.log(`Data sent to queue: ${queue}`);
  setTimeout(async () => {
    await channel.close();
    await connection.close();
  }, 500);
};

export default {
  sendToQueue,
};
