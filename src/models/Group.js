import { Base } from './Base.js';
import { GroupAudioConfig } from './GroupAudioConfig.js';
import { GroupAudioCounts } from './GroupAudioCounts.js';
import { GroupExtended } from './GroupExtended.js';
import { GroupMessageConfig } from './GroupMessageConfig.js';

class Group extends Base {
  constructor (client, data) {
    super(client);
    this.id = data?.id;
    this.hash = data?.hash;
    this.name = data?.name;
    this.description = data?.description;
    this.reputation = data?.reputation;
    this.owner = data?.owner;
    this.membersCount = data?.members;
    this.official = data?.official;
    this.peekable = data?.peekable;
    this.premium = data?.premium;
    this.icon = data?.icon;
    this.extended = new GroupExtended(client, data?.extended);
    this.audioCounts = new GroupAudioCounts(client, data?.audioCounts);
    this.audioConfig = new GroupAudioConfig(client, data?.audioConfig);
    this.messageConfig = new GroupMessageConfig(client, data?.messageConfig);
    this._members = [];
  }
}

export { Group };