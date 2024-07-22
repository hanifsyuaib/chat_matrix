<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
    <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-blue-600 text-white p-4 flex justify-between items-center">
        <span class="text-xl font-bold">ChatMatrix</span>
        <span class="relative group">
          Welcome, {{ username }}
          <router-link to="/logout/">
            <button @click="logout" class="text-white ml-2 relative">
              <i class="ri-logout-box-r-line text-xl"></i>
              <span class="tooltip group-hover:opacity-100">
                Logout
              </span>
            </button>
          </router-link>
        </span>
      </div>
      <div class="flex flex-col h-[calc(100vh-200px)] p-4 overflow-y-auto">
        <ul class="space-y-4">
          <li v-for="(chat, index) in chats" :key="index" :class="{'text-right': !chat.response}">
            <div :class="{'bg-green-100': !chat.response, 'bg-gray-100': chat.response}" class="inline-block p-3 rounded-lg max-w-2xl">
              <div class="font-bold" v-if="!chat.response">You</div>
              <div class="font-bold" v-if="chat.response">ChatMatrix</div>
              <div v-html="formatMessage(chat.response || chat.message)"></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="p-4 border-t border-gray-200 flex items-center">
        <textarea
          id="messageInput"
          class="flex-grow border rounded-lg px-4 py-2 focus:outline-none resize-none overflow-hidden"
          v-model="newMessage"
          placeholder="Type your message..."
          aria-label="messageInput"
          @keydown.enter.prevent="handleEnter"
          @input="autoResize"
          required
        ></textarea>
        <button type="button" class="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-full" @click="sendMessage">
          <i class="ri-send-plane-2-fill text-xl"></i>
        </button>
      </div>
      <div class="text-xs text-gray-500 text-center memo-margin">
        Press <span class="font-semibold">Shift + Enter</span> for a new line
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const newMessage = ref('');
const chats = ref([]);
const username = ref('dummy02');
const router = useRouter();

const fetchChats = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/chatbot/');
    chats.value = response.data.chats || []; // Ensure chats is an array
  } catch (error) {
    console.error('Error fetching chats:', error);
    chats.value = []; // Fallback to empty array if fetch fails
  }
};

const sendMessage = async () => {
  if (!newMessage.value) return;

  const message = newMessage.value;

  chats.value.push({ message }); // Add the user's message to the chat

  try {
    const response = await axios.post('http://127.0.0.1:8000/chatbot/', {
      message,
    }, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });

    // Add the ChatMatrix's response to the chat
    chats.value.push({ response: response.data.response });
  } catch (error) {
    console.error('Error sending message:', error);
  }

  newMessage.value = ''; // Clear input
};

const handleEnter = (event) => {
  if (event.shiftKey) {
    newMessage.value += '\n'; // Add newline if Shift + Enter is pressed
  } else {
    sendMessage(); // Send message on Enter
  }
};

const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto'; // Reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
};

const formatMessage = (message) => message.replace(/\n/g, '<br>'); // Replace newlines with <br>

const logout = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/logout/', {}, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

onMounted(fetchChats);
</script>

<style scoped>
body {
  @apply min-h-screen bg-gray-100;
}
.memo-margin {
  margin-top: -1%;
  margin-bottom: 1%;
}
.tooltip {
  @apply absolute left-1/2 transform -translate-x-1/2 -bottom-6 bg-gray-700 text-white text-xs rounded-lg px-2 py-1 opacity-0 transition-opacity duration-200 ease-in-out;
  pointer-events: none;
}
</style>
