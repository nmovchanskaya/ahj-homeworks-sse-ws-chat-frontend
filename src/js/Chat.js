import ChatAPI from './api/ChatAPI';
import Modal from './Modal';
import WS from './api/WS';

export default class Chat {
  constructor(container) {
    this.container = container;

    let protocol;
    if (process.env.NODE_ENV === 'development') {
      this.urlServer = 'localhost:3000';
      protocol = 'http';
      this.ptotocolWS = 'ws';
    }
    else {
      this.urlServer = 'ahj-homeworks-sse-ws-chat-backend.onrender.com';
      protocol = 'https';
      this.ptotocolWS = 'wss';
    }
    this.api = new ChatAPI(protocol, this.urlServer);
    this.ws = null;

    this.onModalSubmit = this.onModalSubmit.bind(this);
    this.onNewUserAdded = this.onNewUserAdded.bind(this);
    this.onGetMessage = this.onGetMessage.bind(this);
  }

  init() {
    this.modal = new Modal('.modal__form', this.onModalSubmit);
    this.modal.bindToDOM();
    this.modal.init();
  }

  onNewUserAdded(data) {
    if (data.status === 'error') {
      this.modal.renderMessage(data.message);
      return;
    }
    // console.log(data.user);
    if (data.status === 'ok') {
      // console.log(data.status);
      // close the popup
      this.modal.modalInput.value = '';
      this.modal.toggle();

      // add user to list of users
      this.currentUser = data.user;
      // this.renderUser(data.user);

      // open ws connection, params: url, callback fuction for getting message
      this.ws = new WS(`${this.ptotocolWS}://${this.urlServer}/ws`, this.onGetMessage);
      this.ws.addListeners();
    }
  }

  onGetMessage(e) {
    console.log(e);

    const data = JSON.parse(e.data);
    // console.log(data);
    // if message - add new
    if (Object.keys(data).indexOf('text') > -1) {
      this.renderMessage(data);
    } else {
      // if list of users - refresh it
      this.clearUsers();
      data.forEach((item) => {
        this.renderUser(item);
      });
    }

    console.log('ws message');
  }

  onModalSubmit(e) {
    e.preventDefault();

    const nick = this.modal.modalInput.value.trim();
    if (nick) {
      // create new User
      this.api.create({ name: nick }, this.onNewUserAdded);
    } else {
      this.modal.renderMessage('Input your nickname');
    }
  }

  bindToDOM() {
    this.userListElem = document.querySelector('.chat__userlist');
    this.messageInput = document.querySelector('.form__input');
    this.chatForm = document.querySelector('.chat__form');
    this.chatContainer = document.querySelector('.chat__messages-container');
    this.logoutBtn = document.querySelector('.logout');
  }

  registerEvents() {
    this.sendMessage = this.sendMessage.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  subscribeOnEvents() {
    this.chatForm.addEventListener('submit', this.sendMessage);
    this.logoutBtn.addEventListener('click', this.onLogout);
  }

  sendMessage(e) {
    e.preventDefault();

    const message = {
      text: this.messageInput.value,
      user: this.currentUser.name,
      date: Date.now(),
      type: 'send',
    };

    if (!message) return;

    this.ws.send(JSON.stringify(message));

    this.messageInput.value = '';
  }

  renderMessage(message) {
    let messageClass;
    let user;
    const date = new Date(message.date);

    if (message.user === this.currentUser.name) {
      messageClass = 'message__container-yourself';
      user = 'You';
    } else {
      messageClass = 'message__container-interlocutor';
      user = message.user;
    }
    const msgMarkup = `
      <div class="message__container ${messageClass}">
        <div class="message__header">
          ${user}  ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()}
        </div>
        ${message.text}
      </div>
    `;
    this.chatContainer.insertAdjacentHTML('beforeend', msgMarkup);
  }

  clearUsers() {
    const users = Array.from(this.userListElem.querySelectorAll('.chat__user'));
    users.forEach((item) => {
      item.remove();
    });
  }

  clearMessages() {
    const msgs = Array.from(this.chatContainer.querySelectorAll('.message__container'));
    msgs.forEach((item) => {
      item.remove();
    });
  }

  renderUser(user) {
    const userMarkup = `
      <div class="chat__user">
        ${user.name}
      </div>
    `;
    this.userListElem.insertAdjacentHTML('beforeend', userMarkup);
  }

  onLogout() {
    const message = {
      user: this.currentUser,
      type: 'exit',
    };

    this.ws.send(JSON.stringify(message));
    this.ws.close();
    this.clearUsers();
    this.clearMessages();
    this.modal.clearMessage();
    this.modal.toggle();
  }
}
