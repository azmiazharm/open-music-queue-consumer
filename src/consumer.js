require('dotenv').config();
const amqp = require('amqplib');

const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const CacheService = require('./CacheService');
const Listener = require('./listener');

const init = async () => {
  const cacheService = new CacheService();
  const playlistsService = new PlaylistsService(cacheService);
  const mailSender = new MailSender();
  const listener = new Listener(mailSender, playlistsService);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
