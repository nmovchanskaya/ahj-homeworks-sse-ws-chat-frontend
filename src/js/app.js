import Chat from './Chat';

const root = document.getElementById('root');

const app = new Chat(root);

app.init();
app.bindToDOM();
app.registerEvents();
app.subscribeOnEvents();