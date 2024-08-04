<template>
  <div class="dashboard p-6 bg-gray-100 flex flex-col items-center justify-center">
    <div class="logo mb-6">
      <img src="../assets/logo-mtx.png" alt="Logo-mtx" class="h-32 max-w-full object-contain">
    </div>
    <div class="description text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">Welcome to Dashboard</h1>
      <p class="text-gray-600 text-xl">Choose one of the services below to get started.</p>
    </div>
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Sentiment Analysis Button -->
        <a href="/sentiment-analysis/" class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300 hover:bg-yellow-300">
          <i class="ri-emotion-fill text-5xl text-yellow-500 mb-4"></i>
          <span class="text-2xl font-semibold">Sentiment Analysis</span>
        </a>

        <!-- Summarize Text Button -->
        <a href="/summarize-text/" class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300 hover:bg-green-300">
          <i class="ri-file-text-fill text-5xl text-green-500 mb-4"></i>
          <span class="text-2xl font-semibold">Summarize Text</span>
        </a>

        <!-- Number Plate Recognition Button -->
        <a href="/plate-recognition/" class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300 hover:bg-purple-300">
          <i class="ri-car-fill text-5xl text-purple-500 mb-4"></i>
          <span class="text-2xl font-semibold">Plate Recognition</span>
        </a>
      </div>
    </div>

    <!-- User Info Card -->
    <h3 class="text-lg font-semibold mb-2 mt-8">Your Information</h3>
    <div class="bg-white p-4 rounded-lg shadow-lg max-w-sm text-left break-words">
      <p class="text-gray-800 text-xl font-semibold">
        <i class="ri-user-fill text-xl text-blue-500 mr-2"></i>{{ username }}
      </p>
      <p class="text-gray-800 text-xl font-semibold">
        <i class="ri-mail-line text-xl text-blue-500 mr-2"></i>{{ email }}
      </p>
    </div>

    <!-- Change Password Button -->
    <div class="mt-5">
      <button @click="changePassword" class="bg-blue-100 text-blue-500 font-bold py-2 px-4 rounded-full text-xm transition-colors duration-300 hover:bg-blue-500 hover:text-white">
        Change Password
      </button>
    </div>

    <!-- Logout Button -->
    <div class="mt-16">
      <button @click="logout" class="bg-red-100 text-red-500 font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300 hover:bg-red-500 hover:text-white">
        Logout
      </button>
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

const username = ref('');
const email = ref('');
const router = useRouter();

const accessDashboard = async () => {
  try {
    const response = await axios.get('/api/dashboard/');
    username.value = response.data.username;
    email.value = response.data.email;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to login page if not authenticated
      router.push('/login/');
    } else {
      console.error('Error accessing dashboard:', error);
    }
  }
};

const changePassword = () => {
  router.push('/change-password/');
};

const logout = () => {
  router.push('/logout/');
};

onMounted(() => {
  accessDashboard();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}
.logo img {
  height: 8rem;
}
.break-words {
  word-break: break-word;
}
</style>
