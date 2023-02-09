import Base from './Base.js';

class NotificationAction extends Base {
  constructor (client, data) {
    super(client);
    this.id = data?.id;
    this.titleText = data?.titleText;
    this.actionUrl = data?.actionUrl;
    this.external = data?.external;
    this.imageUrl = data?.imageUrl;
  }
}

export default NotificationAction;
