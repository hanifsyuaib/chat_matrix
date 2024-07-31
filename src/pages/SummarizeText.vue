<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <div class="bg-teal-500 text-white p-4 flex items-center relative fixed top-0 z-50">
        <!-- Grid container for the header layout -->
        <div class="grid grid-cols-3 w-full">
          <!-- Dashboard button -->
          <div class="flex items-center justify-start relative">
            <span class="relative group">
              <router-link to="/dashboard/" class="flex items-center justify-center p-2 rounded-full hover:bg-blue-500 transition-colors duration-300">
                <i class="ri-home-2-line text-3xl text-white mr-8 ml-8"></i>
              </router-link>
              <span class="tooltip">Dashboard</span>
            </span>
          </div>

          <!-- Summarize Text dropdown button -->
          <div class="flex items-center justify-center relative">
            <div class="relative flex items-center">
              <button @click="toggleDropdown" class="flex items-center focus:outline-none px-2 py-1 hover:bg-teal-600 rounded-lg transition-colors duration-300">
                <span class="text-2xl font-bold">Summarize Text</span>
                <i class="ri-arrow-down-s-line text-3xl ml-1 mt-1"></i>
              </button>
              <div v-if="dropdownOpen" class="dropdown-menu absolute left-0 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                <router-link to="/summarize-text/" class="block px-4 py-2 font-semibold text-gray-500 hover:bg-green-100 rounded-lg mb-1 flex items-center">
                  <i class="ri-file-text-fill text-2xl text-gray-500 mr-4"></i>
                  <span>Summarize Text</span>
                </router-link>
                <router-link to="/sentiment-analysis/" class="block px-4 py-2 font-semibold text-gray-500 hover:bg-yellow-100 rounded-lg mb-1 mt-1 flex items-center">
                  <i class="ri-emotion-fill text-2xl text-gray-500 mr-4"></i>
                  <span>Sentiment Analysis</span>
                </router-link>
                <router-link to="/plate-recognition/" class="block px-4 py-2 font-semibold text-gray-500 hover:bg-purple-100 rounded-lg mb-1 flex items-center">
                  <i class="ri-car-fill text-2xl text-gray-500 mr-4"></i>
                  <span>Plate Recognition</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Logout button -->
          <div class="flex items-center justify-end relative">
            <span class="relative group">
              <router-link to="/logout/" class="flex items-center justify-center p-2 rounded-full hover:bg-red-500 transition-colors duration-300">
                <i class="ri-logout-box-r-line text-3xl text-white mr-8 ml-8"></i>
              </router-link>
              <span class="tooltip">Logout</span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex-grow p-4 overflow-y-auto relative">
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

        <!-- Scroll to Top Button -->
        <button v-if="showScrollTopButton" @click="scrollToTop" class="scroll-button fixed bottom-20 right-4 bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300">
          <i class="ri-arrow-up-s-line text-2xl"></i>
        </button>

        <!-- Scroll to Bottom Button -->
        <button v-if="showScrollBottomButton" @click="scrollToBottom" class="scroll-button fixed bottom-4 right-4 bg-teal-500 text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300">
          <i class="ri-arrow-down-s-line text-2xl"></i>
        </button>
      </div>
      <div class="p-4 border-t border-gray-200 flex items-center">
        <textarea
          id="messageInput"
          class="flex-grow border rounded-lg px-4 py-2 focus:outline-none resize-none overflow-hidden"
          v-model="newMessage"
          placeholder="Copy and paste your text here to be summarize..."
          aria-label="messageInput"
          @keydown.enter.prevent="handleEnter"
          @input="autoResize"
          required
        ></textarea>
        <button type="button" class="ml-2 p-2 text-teal-500 hover:bg-teal-100 rounded-full" @click="sendMessage">
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
const showScrollTopButton = ref(false);
const showScrollBottomButton = ref(false);
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
    const response = await axios.get('/api/summarize-text/');
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

  // Directly reset the textarea height
  const textarea = document.getElementById('messageInput');
  textarea.style.height = 'auto';

  try {
    const response = await axios.post('/api/summarize-text/', {
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToBottom = () => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
};

const checkScrollButtons = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  showScrollTopButton.value = scrollPosition > 300; // Show "Scroll to Top" button if scrolled down 300px
  showScrollBottomButton.value = scrollPosition < documentHeight - windowHeight - 300; // Show "Scroll to Bottom" button if not at the bottom
};

const autoResize = (event) => {
  const textarea = event.target;
  const maxHeight = window.innerHeight / 2;

  textarea.style.height = 'auto'; // Reset height
  if (textarea.scrollHeight <= maxHeight) {
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
    textarea.style.overflowY = 'hidden'; // Hide overflow if within max height
  } else {
    textarea.style.height = `${maxHeight}px`; // Set height to max height
    textarea.style.overflowY = 'scroll'; // Enable scrolling if exceeding max height
  }

  // Scroll to the bottom of the page to show the newest cursor position
  setTimeout(() => {
    scrollToBottom();
  }, 0);
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
  window.addEventListener('scroll', checkScrollButtons); // Check scroll position on scroll
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
  @apply absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-gray-700 text-white text-base rounded-lg px-2 py-1 opacity-0 transition-opacity duration-200 ease-in-out;
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
  left: 0;
  min-width: 100%; /* Ensure the dropdown is as wide as the button */
}
.group > .tooltip {
  @apply opacity-0;
}
.group:hover > .tooltip {
  @apply opacity-100;
}
.dropdown-menu i {
  margin-right: 1rem; /* Adjust spacing between icon and text */
}
.scroll-button {
  @apply z-50;
  transition: opacity 0.3s ease-in-out;
}
</style>
