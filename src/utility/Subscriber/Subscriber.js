import { Base } from '../../models/Base.js';
import { PrivilegeUtil } from './Privilege.js';
import { WOLFAPIError } from '../../models/WOLFAPIError.js';
import validator from '../../validator/index.js';

class Subscriber extends Base {
  constructor (client) {
    super(client);
    this.privilege = new PrivilegeUtil(client);
  }

  async avatar (targetGroupId, size = 128) {
    if (validator.isNullOrUndefined(targetGroupId)) {
      throw new WOLFAPIError('targetGroupId cannot be null or undefined', { targetGroupId });
    } else if (!validator.isValidNumber(targetGroupId)) {
      throw new WOLFAPIError('targetGroupId must be a valid number', { targetGroupId });
    } else if (validator.isLessThanOrEqualZero(targetGroupId)) {
      throw new WOLFAPIError('targetGroupId cannot be less than or equal to 0', { targetGroupId });
    }

    if (validator.isNullOrUndefined(size)) {
      throw new WOLFAPIError('size cannot be null or undefined', { size });
    } else if (!validator.isValidNumber(targetGroupId)) {
      throw new WOLFAPIError('size must be a valid number', { size });
    } else if (validator.isLessThanOrEqualZero(size)) {
      throw new WOLFAPIError('size cannot be less than or equal to 0', { size });
    }
    // TODO:
  }
}

export { Subscriber };