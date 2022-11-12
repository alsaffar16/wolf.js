import Base from './Base.js';

class StoreProductImage extends Base {
  constructor (client, data) {
    super(client);

    this.url = data.url;
  }

  toJSON () {
    return {
      url: this.url
    };
  }
}

export default StoreProductImage;
