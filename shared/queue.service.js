class QueueService {
  constructor(queueDriver) {
    this.queueDriver = queueDriver;
  }

  add(data, opts) {
    return this.queueDriver.add(data, opts);
  }

  process(callback) {
    return this.queueDriver.process(callback);
  }
}

module.exports = QueueService;
