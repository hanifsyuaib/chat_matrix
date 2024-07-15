<template>
  <div class="chat-container">
    <div class="card">
      <div class="card-header bg-primary text-white">
        ChatMatrix
        <button @click="logout" class="btn btn-danger btn-sm float-right">Logout</button>
      </div>
      <div class="card-body messages-box">
        <ul class="list-unstyled messages-list">
          <li v-for="chat in chats" :key="chat.message" class="message received">
            <div class="message-text">
              <div class="message-sender"><b>ChatMatrix</b></div>
              <div class="message-content">{{ chat.response }}</div>
            </div>
          </li>
          <li v-for="chat in chats" :key="chat.response" class="message sent">
            <div class="message-text">
              <div class="message-sender"><b>You</b></div>
              <div class="message-content">{{ chat.message }}</div>
            </div>
          </li>
        </ul>
      </div>
      <form class="message-form" @submit.prevent="sendMessage">
        <div class="input-group">
          <input
            type="text"
            id="messageInput"
            class="form-control message-input"
            v-model="newMessage"
            placeholder="Type your message..."
            aria-label="sendMessage"
            required
          />
          <div class="input-group-append">
            <button type="submit" class="btn btn-primary btn-send">Send</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const newMessage = ref('');
const chats = ref([]);
const router = useRouter();

const fetchChats = async () => {
  try {
    const response = await axios.get('/chatbot/');
    chats.value = response.data.chats;
  } catch (error) {
    console.error('Error fetching chats:', error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value) return;

  const message = newMessage.value;
  chats.value.push({ message, response: '...' }); // Temporary response

  try {
    const response = await axios.post('/chatbot/', {
      message,
    }, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });

    // Replace temporary response with the actual response
    const chatIndex = chats.value.length - 1;
    chats.value[chatIndex].response = response.data.response;
  } catch (error) {
    console.error('Error sending message:', error);
  }

  newMessage.value = ''; // Clear input
};

const logout = async () => {
  try {
    await axios.post('/logout/'); // Adjust the URL based on routing
    router.push('/login'); // Redirect to login page after logout
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

onMounted(fetchChats);
</script>

<style>

</style>
