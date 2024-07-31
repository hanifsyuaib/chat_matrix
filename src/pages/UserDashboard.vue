<template>
  <div class="dashboard p-6 bg-gray-100 flex flex-col items-center justify-center">
    <div class="logo mb-6">
      <img src="../assets/logo.png" alt="Logo" class="h-32">
    </div>
    <div class="description text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">Welcome to Dashboard - {{ username }}</h1>
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
const router = useRouter();

const AccessDashboard = async () => {
  try {
    const response = await axios.get('/api/dashboard/');
    username.value = response.data.username;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to login page if not authenticated
      router.push('/login/');
    } else {
      console.error('Error accessing dashboard:', error);
    }
  }
};

const logout = () => {
  router.push('/logout/');
};

onMounted(() => {
  AccessDashboard();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}
.logo img {
  height: 8rem;
}
</style>
