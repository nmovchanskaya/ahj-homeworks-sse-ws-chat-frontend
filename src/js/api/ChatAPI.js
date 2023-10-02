import createRequest from './createRequest';

export default class ChatAPI {
  constructor(protocol, url) {
    this.url = url;
    this.protocol = protocol;
  }

  create(data, callback) {
    createRequest({
      url: this.protocol + '://' + this.url,
      sendMethod: 'POST',
      method: 'new-user',
      data,
      callback,
    });
  }
}
