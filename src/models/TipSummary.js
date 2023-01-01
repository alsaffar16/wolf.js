import Base from './Base.js';
import TipCharm from './TipCharm.js';

class TipSummary extends Base {
  constructor (client, data) {
    super(client);
    this.id = data?.id;
    this.charmList = data?.charmList.map((charm) => new TipCharm(client, charm)) ?? [];
    this.version = data?.version;
  }

  async charms () {
    return await this.client.charm.getByIds(this.list.map((charm) => charm.charmId));
  }

  toJSON () {
    return {
      id: this.id,
      charmList: this.charmList.map((item) => item.toJSON()),
      version: this.version
    };
  }
}

export default TipSummary;
