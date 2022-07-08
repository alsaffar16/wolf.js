const Base = require('./Base');

class CharmStatistics extends Base {
  constructor (client, data) {
    super(client);

    this.subscriberId = data.subscriberId;
    this.totalGiftedSent = data.totalGiftedSent;
    this.totalGiftedReceived = data.totalGiftedReceived;
    this.totalLifetime = data.totalLifetime;
    this.totalActive = data.totalActive;
    this.totalExpired = data.totalExpired;
  }
}

module.exports = CharmStatistics;
