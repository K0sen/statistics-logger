const cluster = require('cluster');
const { APPLICATIONS_AMOUNT, REDIS_PORT, QUEUE_NAME } = process.env;

if (cluster.isMaster) {
  const os = require('os');
  const cpusLength = os.cpus().length;
  const workersAmount = Math.ceil(cpusLength / APPLICATIONS_AMOUNT);
  for (let i = 0; i < workersAmount; i++) {
    cluster.fork();
  }
} else {
  const Queue = require('bull');
  const fastify = require('fastify')();
  const RequestValidator = require('./requestValidator');

  const HOST = '0.0.0.0';
  const PORT = 3000;
  const requestValidator = new RequestValidator();
  const QueueService = require('../shared/queue.service.js')
  const queue = new QueueService(new Queue(QUEUE_NAME, { redis: REDIS_PORT }));

  fastify.get('/api/v1/track', async (request, reply) => {
    const { account_id, url } = request.query;
    const preparedReply = reply.header('Content-Type', 'application/json; charset=utf-8');
    if (requestValidator.validate({ account_id, url })) {
      try {
        await queue.add({ account_id, url });
      } catch(error) {
        console.log(error);
        preparedReply.code(500).send({ message: 'Server error.' });
      }

      preparedReply.send({ message: 'Statistics have been recorded.' });
    } else {
      preparedReply.code(400).send({ message: 'Error. Wrong request body.' });
    }
  });

  fastify.listen(PORT, HOST, () => console.log(`Server is listening on port: ${PORT}`));
}
