<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
    <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-blue-600 text-white p-4 flex justify-between items-center relative">
        <div class="relative flex items-center">
          <button @click="toggleDropdown" class="flex items-center focus:outline-none hover:bg-blue-700 px-2 py-1 rounded-md">
            <span class="text-xl font-bold">Sentiment Analysis</span>
            <i class="ri-arrow-down-s-line text-xl ml-1"></i>
          </button>
          <div v-if="dropdownOpen" class="dropdown-menu absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <router-link to="/sentiment-analysis/" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Sentiment Analysis
            </router-link>
            <router-link to="/summary/" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Summary
            </router-link>
          </div>
        </div>
        <span class="relative group">
          <router-link to="/logout/">
            <i class="ri-logout-box-r-line text-xl"></i>
            <span class="tooltip group-hover:opacity-100">
              Logout
            </span>
          </router-link>
        </span>
      </div>
      <div class="flex flex-col h-[calc(100vh-200px)] p-4 overflow-y-auto">
        <ul class="space-y-4">
          <li v-for="(chat, index) in chats" :key="index">
            <div v-if="chat.message" class="chat-item right-align">
              <div class="bg-green-100 inline-block p-3 rounded-lg max-w-2xl left-align">
                <div class="font-bold">{{ username }}</div>
                <div v-html="formatMessage(chat.message)"></div>
              </div>
            </div>
            <div v-if="chat.response" class="chat-item left-align">
              <div class="bg-gray-100 inline-block p-3 rounded-lg max-w-2xl left-align">
                <div class="font-bold">ChatMatrix</div>
                <div v-html="formatMessage(chat.response)"></div>
              </div>
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

// Ensure credentials (such as cookies) are included with every request
axios.defaults.withCredentials = true;
const baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.baseURL = baseURL;

const newMessage = ref('');
const chats = ref([]);
const username = ref('');
const csrftoken = ref('');
const dropdownOpen = ref(false);
const router = useRouter();

const fetchCSRFToken = async () => {
  try {
    const response = await axios.get('/api/get-csrf-token/');
    csrftoken.value = response.data.csrftoken;
  } catch (error) {
    console.error('Error fetching CSRF token: ', error);
  }
};

const fetchChats = async () => {
  try {
    const response = await axios.get('/api/sentiment-analysis/');
    chats.value = response.data.chats || []; // Ensure chats is an array
    username.value = response.data.username;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to login page if not authenticated
      router.push('/login/');
    } else {
      console.error('Error fetching chats:', error);
      chats.value = []; // Fallback to empty array if fetch fails
    }
  }
};

const sendMessage = async () => {
  if (!newMessage.value) return;

  await fetchCSRFToken();

  const message = newMessage.value; // Payload
  chats.value.push({ message }); // Add the user's message to the chat
  newMessage.value = ''; // Clear input

  try {
    const response = await axios.post('/api/sentiment-analysis/', {
      message,
    }, {
      headers: {
        'X-CSRFToken': csrftoken.value,
      },
    });

    // Add the ChatMatrix's response to the chat
    chats.value.push({ response: response.data.response });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const handleEnter = (event) => {
  if (event.shiftKey) {
    const { target: textarea } = event;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const currentMessage = newMessage.value;

    // Add newline at the cursor position
    newMessage.value = `${currentMessage.substring(0, start)}\n${currentMessage.substring(end)}`;

    // Restore cursor position after the newline
    setTimeout(() => {
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
    }, 0);
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

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.relative');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchChats(); // GET Chat history
  document.addEventListener('click', handleClickOutside);
});
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
.chat-item {
  margin-bottom: 1rem;
}
.right-align {
  text-align: right;
}
.left-align {
  text-align: left;
}
.dropdown-menu {
  top: 100%;
}
</style>
