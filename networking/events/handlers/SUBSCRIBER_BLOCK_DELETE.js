
const BaseEvent = require('../../BaseEvent');

module.exports = class SubscriberBlockDelete extends BaseEvent {
  async process (data) {
    this._bot.on._emit(this._command, this._bot.blocked()._process(data.targetId));
  }
};
