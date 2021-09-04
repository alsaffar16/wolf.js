const path = require('path');
const fs = require('fs');

const Websocket = require('./networking/Websocket');
const CommandHandler = require('./command/CommandHandler');

const EventManager = require('./networking/events/EventManager');
const Achievement = require('./helper/achievement/Achievement');
const Authorization = require('./helper/authorization/Authorization');
const Banned = require('./helper/banned/Banned');
const Blocked = require('./helper/blocked/Blocked');
const Charm = require('./helper/charm/Charm');
const Contact = require('./helper/contact/Contact');
const Discovery = require('./helper/discovery/Discovery');
const Event = require('./helper/event/Event');
const Group = require('./helper/group/Group');
const Messaging = require('./helper/messaging/Messaging');
const Notification = require('./helper/notification/Notification');
const Phrase = require('./helper/phrase/Phrase');
const Stage = require('./helper/stage/Stage');
const Subscriber = require('./helper/subscriber/Subscriber');
const Tip = require('./helper/tip/Tip');

const yaml = require('yaml');

const validator = require('./utils/validator');

const crypto = require('crypto');
const Utilities = require('./utility');

const request = require('./constants/request');

const constants = require('@dawalters1/constants');

const MultiMediaService = require('./multimediaservice');
const SubscriberProfileBuilder = require('./utils/ProfileBuilders/SubscriberProfileBuilder');

const fileType = require('file-type');

const validateConfig = (api, config) => {
  if (!config) {
    throw new Error('config cannot be null or empty\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  if (!config.keyword) {
    throw new Error('app must contain keyword\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  } else if (validator.isNullOrWhitespace(config.keyword)) {
    throw new Error('keyword cannot be null or empty\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  if (!config.app) {
    throw new Error('config must contain app\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  const app = config.app;

  if (!app.defaultLanguage) {
    throw new Error('config must contain a defaultLanguage\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  } else if (validator.isNullOrWhitespace(app.defaultLanguage)) {
    throw new Error('defaultLanguage must be a string\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  config.options = {
  };

  if (!app.commandSettings) {
    throw new Error('app must contain commandSettings\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  const commandSettings = app.commandSettings;

  if (!commandSettings.ignoreOfficialBots) {
    throw new Error('commandSettings must contain ignoreOfficialBots\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  } else if (!validator.isValidBoolean(commandSettings.ignoreOfficialBots)) {
    throw new Error('ignoreOfficialBots is not a valid boolean\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
  }

  config.options.ignoreOfficialBots = commandSettings.ignoreOfficialBots;

  if (app.defaultLanguage) {
    config.options.defaultLanguage = app.defaultLanguage || 'en';
  };

  api.config = config;
};

module.exports = class WolfBot {
  constructor () {
    const configPath = path.join(path.dirname(require.main.filename), '/config/');

    if (fs.existsSync(configPath)) {
      if (fs.existsSync(`${configPath}/default.yaml`)) {
        validateConfig(this, yaml.parse(fs.readFileSync(`${configPath}/default.yaml`, 'utf-8')));
      } else {
        throw new Error('File default.yaml missing in config folder\nSee https://github.com/dawalters1/Bot-Template/blob/main/config/default.yaml');
      }
    } else {
      throw new Error('Folder config missing\nSee https://github.com/dawalters1/Bot-Template/tree/main/config');
    }

    this._eventManager = new EventManager(this);
    this.websocket = new Websocket(this);
    this.commandHandler = new CommandHandler(this);

    this._achievement = new Achievement(this);
    this._authorization = new Authorization(this);
    this._banned = new Banned(this);
    this._blocked = new Blocked(this);
    this._charm = new Charm(this);
    this._contact = new Contact(this);
    this._discovery = new Discovery(this);
    this._event = new Event(this);
    this._group = new Group(this);
    this._messaging = new Messaging(this);
    this._notification = new Notification(this);
    this._phrase = new Phrase(this);
    this._stage = new Stage(this);
    this._subscriber = new Subscriber(this);
    this._tip = new Tip(this);
    this.currentSubscriber = null;

    this._multiMediaService = new MultiMediaService(this);

    this._utilities = Utilities(this);
  }

  get on () {
    return this._eventManager;
  }

  /**
   * Exposes the achievement methods
   */
  achievement () {
    return this._achievement;
  }

  /**
   * Exposes the authorization methods
   */
  authorization () {
    return this._authorization;
  }

  /**
   * Exposes the banned methods
   */
  banned () {
    return this._banned;
  }

  /**
   * Exposes the blocked methods
   */
  blocked () {
    return this._blocked;
  }

  /**
   * Exposes the charm methods
   */
  charm () {
    return this._charm;
  }

  /**
   * Exposes the contact methods
   */
  contact () {
    return this._contact;
  }

  /**
   * Exposes the discovery methods (LIMITED Setup)
   */
  discovery () {
    return this._discovery;
  }

  /**
   * Exposes the event methods
   */
  event () {
    return this._event;
  }

  /**
   * Exposes the group methods
   */
  group () {
    return this._group;
  }

  /**
   * Exposes the messaging methods
   */
  messaging () {
    return this._messaging;
  }

  /**
   * Exposes the notification methods
   */
  notification () {
    return this._notification;
  }

  /**
   * Exposes the phrase methods
   */
  phrase () {
    return this._phrase;
  }

  /**
   * Exposes the stage methods
   */
  stage () {
    return this._stage;
  }

  /**
   * Exposes the subscriber methods
   */
  subscriber () {
    return this._subscriber;
  }

  /**
   * Exposes the tip methods
   */
  tip () {
    return this._tip;
  }

  /**
   * Exposes the utilities
   */
  utility () {
    return this._utilities;
  }

  /**
   *
   * @returns {MultiMediaService}
   */
  _mediaService () {
    return this._multiMediaService;
  }

  /**
   * Login to an account - Use @dawalters1/constants for loginDevice, onlineState & loginType
   * @param {*} email - The email that belongs to the account
   * @param {*} password - The password that belongs to the account
   * @param {*} loginDevice - Android, iPhone, Web & iPad
   * @param {*} onlineState - Online, Busy, Away, Invisible
   * @param {*} loginType - Email, Google, Facebook, Twitter, Snapchat, apple
   * @param {*} token - The token belonging to the account, leave unset for one to automatically be generated
   */
  login (email, password, loginDevice = constants.loginDevice.ANDROID, onlineState = constants.onlineState.ONLINE, loginType = constants.loginType.EMAIL, token = undefined) {
    if (validator.isNullOrWhitespace(email)) {
      throw new Error('email cannot be null or empty');
    }

    if (validator.isNullOrWhitespace(password)) {
      throw new Error('password cannot be null or empty');
    }

    if (validator.isNullOrWhitespace(loginDevice)) {
      throw new Error('loginDevice must be a valid string');
    } else if (!Object.values(constants.loginDevice).includes(loginDevice)) {
      throw new Error('loginDevice is not valid');
    }

    if (!validator.isValidNumber(onlineState)) {
      throw new Error('onlineState must be a valid number');
    } else if (!Object.values(constants.onlineState).includes(onlineState)) {
      throw new Error('onlineState is not valid');
    }

    if (validator.isNullOrWhitespace(loginType)) {
      throw new Error('loginType must be a valid string');
    } else if (!Object.values(constants.loginType).includes(loginType)) {
      throw new Error('loginType is not valid');
    }

    this.config._loginSettings = {
      email,
      password,
      loginDevice,
      onlineState,
      loginType,
      token: token && !validator.isNullOrWhitespace(token) ? token : crypto.randomBytes(32).toString('hex')
    };

    this._eventManager._register();
    this.websocket.create();
  }

  /**
   * Logout the account
   */
  logout () {
    this.websocket.emit(request.SECURITY_LOGOUT);

    this.websocket.socket.disconnect();

    this._eventManager._unregister();

    this._clearCache();
  }

  /**
   * Set the online state for the bot - Use @dawalters1/constants
   * @param {*} onlineState
   */
  async setOnlineState (onlineState) {
    if (!validator.isValidNumber(onlineState)) {
      throw new Error('onlineState must be a valid number');
    } else if (!Object.values(constants.onlineState).includes(onlineState)) {
      throw new Error('onlineState is not valid');
    }

    return await this.websocket.emit(request.SUBSCRIBER_SETTINGS_UPDATE, {
      state: {
        state: onlineState
      }
    });
  }

  async search (query) {
    if (validator.isNullOrWhitespace(query)) {
      throw new Error('query cannot be null or empty');
    }

    return await this.websocket.emit(request.SEARCH, {
      query,
      types: ['related', 'groups']
    });
  }

  /**
   * Retrieve the bots conversation list
   * @param {Number} timestamp - Timestamp where conversation list should start - (Optional)
   */
  async getConversationList (timestamp = undefined) {
    if (timestamp) {
      if (!validator.isValidNumber(timestamp)) {
        throw new Error('timestamp must be a valid number');
      } else if (validator.isLessThanZero(timestamp)) {
        throw new Error('timestamp cannot be negative');
      }
    }
    const result = await this.websocket.emit(request.MESSAGE_CONVERSATION_LIST, {
      headers: {
        version: 3
      },
      body: {
        timestamp
      }
    });

    result.body = result.success
      ? result.body.map((message) => ({
        id: message.id,
        body: message.data.toString(),
        sourceSubscriberId: message.originator.id,
        targetGroupId: message.isGroup ? message.recipient.id : null,
        embeds: message.embeds,
        metadata: message.metadata,
        isGroup: message.isGroup,
        timestamp: message.timestamp,
        edited: message.edited,
        type: message.mimeType
      }))
      : [];

    return result;
  }

  /**
   * Set the selected charm to appear on the bots profile
   * @param {[{ position: number, charmId: number }]} charms
   */
  async setSelectedCharms (charms) {
    if (validator.isValidArray(charms)) {
      for (const charm of charms) {
        if (charm) {
          if (charm.position) {
            if (!validator.isValidNumber(charm.position)) {
              throw new Error('position must be a valid number');
            } else if (validator.isLessThanZero(charm.position)) {
              throw new Error('position must be larger than or equal to 0');
            }
          } else {
            throw new Error('charm must contain a position');
          }

          if (charm.charmId) {
            if (!validator.isValidNumber(charm.charmId)) {
              throw new Error('charmId must be a valid number');
            } else if (validator.isLessThanOrEqualZero(charm.charmId)) {
              throw new Error('charmId cannot be less than or equal to 0');
            }
          } else {
            throw new Error('charm must contain a charmId');
          }
        } else {
          throw new Error('charm cannot be null or empty');
        }
      }
    } else {
      if (charms) {
        if (charms.position) {
          if (!validator.isValidNumber(charms.position)) {
            throw new Error('position must be a valid number');
          } else if (validator.isLessThanZero(charms.position)) {
            throw new Error('position must be larger than or equal to 0');
          }
        } else {
          throw new Error('charm must contain a position');
        }

        if (charms.charmId) {
          if (!validator.isValidNumber(charms.charmId)) {
            throw new Error('charmId must be a valid number');
          } else if (validator.isLessThanOrEqualZero(charms.charmId)) {
            throw new Error('charmId cannot be less than or equal to 0');
          }
        } else {
          throw new Error('charm must contain a charmId');
        }
      } else {
        throw new Error('charm cannot be null or empty');
      }
    }

    return await this.websocket.emit(request.CHARM_SUBSCRIBER_SET_SELECTED, {
      selectedList: validator.isValidArray(charms) ? charms : [charms]
    });
  }

  /**
   * Delete charms from the bot account
   * @param {Number[]} charmIds
   */
  async deleteCharms (charmIds) {
    if (validator.isValidArray(charmIds)) {
      if (charmIds.length === 0) {
        throw new Error('charmIds cannot be an empty array');
      }

      for (const charmId of charmIds) {
        if (!validator.isValidNumber(charmId)) {
          throw new Error('charmId must be a valid number');
        } else if (validator.isLessThanOrEqualZero(charmIds)) {
          throw new Error('charmId cannot be less than or equal to 0');
        }
      }
    } else {
      if (charmIds) {
        if (!validator.isValidNumber(charmIds)) {
          throw new Error('charmIds must be a valid number');
        } else if (validator.isLessThanOrEqualZero(charmIds)) {
          throw new Error('charmIds cannot be less than or equal to 0');
        }
      }
    }

    return await this.websocket.emit(request.CHARM_SUBSCRIBER_DELETE, {
      idList: validator.isValidArray(charmIds) ? charmIds : [charmIds]
    });
  }

  /**
   * Get the message filter settings for the bot
   */
  async getMessageSettings () {
    return await this.websocket.emit(request.MESSAGE_SETTING);
  }

  /**
   * Set the message filter settings for the bot - Use @dawalters1/constants for messageFilterTier
   * @param {Number} messageFilterTier
   */
  async setMessageSettings (messageFilterTier) {
    if (!validator.isValidNumber(messageFilterTier)) {
      throw new Error('messageFilterTier must be a valid number');
    } else if (!Object.values(constants.messageFilter).includes(messageFilterTier)) {
      throw new Error('messageFilterTier is not valid');
    }

    return await this.websocket.emit(request.MESSAGE_SETTING_UPDATE, {
      spamFilter: {
        enabled: messageFilterTier !== constants.messageFilter.OFF,
        tier: messageFilterTier
      }
    });
  }

  /**
   * Update the bots avatar
   * @param {Buffer} avatar
   */
  async updateAvatar (avatar) {
    return await this._mediaService().uploadSubscriberAvatar(avatar, (await fileType.fromBuffer(avatar)).mime);
  }

  /**
   * Retrieve the bots credit balance
   */
  async getCreditBalance () {
    return await this.websocket.emit(request.STORE_CREDIT_BALANCE);
  }

  /**
   * Update the bots profile
   * @returns {SubscriberProfileBuilder} subscriber profile builder
   */
  updateProfile () {
    return new SubscriberProfileBuilder(this, this.currentSubscriber);
  }

  /**
   * Retrieve the AWS Cognito token
   * @param {*} requestNew - Request new data from the server
   * @returns { identityId: String, token: String } Cognito Identity
   */
  async getSecurityToken (requestNew = false) {
    if (this._cognito && !requestNew) {
      return this._cognito;
    }

    const result = await this.websocket.emit(request.SECURITY_TOKEN_REFRESH);

    if (result.success) {
      this._cognito = result.body;
    } else {
      throw new Error(result.headers.message || 'Error occurred while requesting new security token');
    }

    return this._cognito;
  }

  _clearCache () {
    this._blocked._clearCache();
    this._contact._clearCache();
    this._charm._clearCache();
    this._event._clearCache();
    this._group._clearCache();
    this._subscriber._clearCache();
    this._notification._clearCache();
    this._achievement._clearCache();
    this._achievement.group()._clearCache();
    this._achievement.subscriber()._clearCache();
    this.currentSubscriber = null;
    this._stage._clearCache();
    this._discovery._clearCache();
  }
};
