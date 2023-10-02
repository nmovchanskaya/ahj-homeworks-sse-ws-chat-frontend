import createRequest from './createRequest';

export default class ChatAPI {
  constructor() {
  }

  create(data, callback) {
    createRequest({
      sendMethod: 'POST',
      method: 'new-user',
      data,
      callback,
    });
  }
}
