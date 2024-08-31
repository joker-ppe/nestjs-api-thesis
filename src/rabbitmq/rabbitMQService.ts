import * as amqp from 'amqplib';

const username = 'joker';
const password = 'Joker@123$';
const host = '54.169.246.109';
const port = 5672; //# Default port for AMQP
const vhost = '/'; //# Default virtual host

const sendToExchange = async (
  exchange: string,
  data: string,
): Promise<void> => {
  const amqp_url = `amqp://${username}:${password}@${host}:${port}${vhost}`;
  const connection = await amqp.connect(amqp_url);
  const channel = await connection.createChannel();
  await channel.assertExchange(exchange, 'fanout', {
    durable: false,
    autoDelete: true,
  });
  channel.publish(exchange, '', Buffer.from(data));
  console.log(`Data sent to exchange: ${exchange}`);

  await channel.close();
  await connection.close();
};

export default {
  sendToExchange,
};
