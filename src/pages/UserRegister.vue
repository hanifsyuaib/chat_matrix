<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <div class="bg-blue-600 text-white text-2xl font-bold text-center py-4 rounded-t-lg">Register</div>
      <div class="p-6">
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4" role="alert">{{ errorMessage }}</div>
        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="username" class="block font-medium mb-1">Username
              <input type="text" id="username" v-model="username" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div class="mb-4">
            <label for="email" class="block font-medium mb-1">Email
              <input type="email" id="email" v-model="email" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div class="mb-4">
            <label for="password1" class="block font-medium mb-1">Password
              <input type="password" id="password1" v-model="password1" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div class="mb-4">
            <label for="password2" class="block font-medium mb-1">Confirm Password
              <input type="password" id="password2" v-model="password2" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition">Register</button>
        </form>
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

const username = ref('');
const email = ref('');
const password1 = ref('');
const password2 = ref('');
const errorMessage = ref('');
const csrftoken = ref('');
const router = useRouter();

const fetchCSRFToken = async () => {
  try {
    const response = await axios.get('/api/get-csrf-token/');
    csrftoken.value = response.data.csrftoken;
  } catch (error) {
    errorMessage.value = 'Error fetching CSRF token';
  }
};

onMounted(() => {
  fetchCSRFToken();
});

const register = async () => {
  errorMessage.value = '';

  try {
    const payload = {
      username: username.value,
      email: email.value,
      password1: password1.value,
      password2: password2.value,
    };

    const response = await axios.post('/api/register/', payload, {
      headers: {
        'X-CSRFToken': csrftoken.value,
      },
    });

    if (response.data.success) {
      router.push('/dashboard/');
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error creating account';
  }
};
</script>
