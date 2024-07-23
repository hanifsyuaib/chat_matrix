<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-6 text-center">
      <h1 class="text-xl font-bold text-blue-600">Logging Out...</h1>
      <p class="mt-4 text-gray-700">Please wait while we log you out.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Ensure credentials (such as cookies) are included with every request
axios.defaults.withCredentials = true;

const csrftoken = ref('');
const router = useRouter();

const fetchCSRFToken = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/get-csrf-token/');
    csrftoken.value = response.data.csrftoken;
  } catch (error) {
    console.error('Error fetching CSRF token: ', error);
  }
};

const logout = async () => {
  await fetchCSRFToken();

  try {
    await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
      headers: {
        'X-CSRFToken': csrftoken.value,
      },
    });

    router.push('/');
  } catch (error) {
    console.error('Error logging out:', error);
    // Provide user feedback in case of error
    alert('Error logging out. Please try again.');
  }
};

onMounted(logout);
</script>
