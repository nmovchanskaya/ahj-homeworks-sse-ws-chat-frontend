export default class Modal {
    constructor(modalElemName, callback) {
        this.modal = document.querySelector(modalElemName);
        this.onModalSubmit = callback;
    }

    bindToDOM() {
        this.modalInput = this.modal.querySelector('.form__input');
        this.modalMessage = this.modal.querySelector('.form__hint');

        this.modal.addEventListener('submit', this.onModalSubmit);
    }

    init() {
        this.toggle();
    }

    toggle() {
        this.modal.classList.toggle('active');
    }

    renderMessage(msg) {
        this.modalMessage.textContent = msg;
    }
    
    clearMessage() {
        if (this.modalMessage) {
            this.modalMessage.remove();
        }
    }
}
