const socket = io();

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');
const chatMessages = document.getElementById('chat-messages');

socket.on('chat message', (msg) => {
    const messageItem = document.createElement('li');
    messageItem.textContent = msg;
    messageItem.classList.add('message-list-item');
    chatMessages.appendChild(messageItem);
});

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    socket.emit('chat message', message);
    messageInput.value = '';
});
