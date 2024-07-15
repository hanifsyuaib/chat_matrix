<template>
  <div>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>Chatbot</title>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      />
    </head>
    <body>
      <div class="chat-container">
        <div class="card flex-grow-1">
          <div class="card-header bg-primary text-white">ChatMatrix</div>
          <div class="card-header bg-primary text-white">
            <b>Welcome, {{ username }}</b>
            <a v-if="user.is_authenticated" style="color: yellow;" href="logout">Logout</a>
            <div v-else>
              <a style="color: yellow;" href="login">Login</a>
              <a style="color: yellow;" href="register">Register</a>
            </div>
          </div>
          <div class="card-body messages-box">
            <ul class="list-unstyled messages-list">
              <li
                v-for="chat in chats"
                :key="chat.id"
                :class="['message', chat.user == request.user ? 'sent' : 'received']"
              >
                <div class="message-text">
                  <div class="message-sender">
                    <b>{{ chat.user == request.user ? 'You' : 'ChatMatrix' }}</b>
                  </div>
                  <div class="message-content">{{ chat.message }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <form class="message-form" @submit.prevent="handleSubmit">
          <div class="input-group">
            <input
              type="text"
              class="form-control message-input"
              placeholder="Type your message..."
              v-model="message"
            />
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary btn-send">Send</button>
            </div>
          </div>
        </form>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </body>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('User'); // Replace with the actual username from your data
const user = ref({ is_authenticated: true }); // Replace with actual user authentication status
const request = ref({ user: 'User' }); // Replace with actual request user data
const chats = ref([
  // Replace with actual chat data
  { id: 1, user: 'User', message: 'Hi there!', response: 'Hello!' },
  { id: 2, user: 'ChatMatrix', message: 'How can I help you today?' },
]);

const message = ref('');

const handleSubmit = () => {
  if (message.value.trim().length === 0) {
    return;
  }

  const newMessage = {
    id: chats.value.length + 1,
    user: request.value.user,
    message: message.value,
    response: '',
  };
  chats.value.push(newMessage);

  message.value = '';

  fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'csrfmiddlewaretoken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      'message': newMessage.message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      newMessage.response = data.response;
      chats.value.push({
        id: chats.value.length + 1,
        user: 'ChatMatrix',
        message: data.response,
      });
    });
};
</script>

<style>
body,
html {
  height: 100%;
}

.messages-box {
  flex: 1;
  overflow-y: auto;
}

.messages-list {
  padding-left: 0;
}

.message {
  margin-bottom: 15px;
  list-style: none;
}

.message-text {
  padding: 10px;
  border-radius: 5px;
}

.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
}

.received {
  background-color: #f1f0f0;
  align-self: flex-start;
}

.message-form {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #f8f9fa;
}

.message-input {
  flex: 1;
  border-radius: 0;
  border-right: none;
}

.btn-send {
  border-radius: 0;
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
