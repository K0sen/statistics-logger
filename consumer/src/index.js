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
  const QueueService = require('../shared/queue.service.js')
  const queue = new QueueService(new Queue(QUEUE_NAME, { redis: REDIS_PORT }));

  queue.process((job, jobDone) => {
    const { account_id, url } = job.data;
    console.log(job.timestamp, account_id, url)
    jobDone();
  });
}

process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
})
