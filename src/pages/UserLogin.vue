<template>
  <div class="flex flex-col p-6 items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <div class="bg-blue-600 text-white text-2xl font-bold text-center py-4 rounded-t-lg">
        Login
      </div>
      <div class="p-6">
        <!-- Error message -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Header for login method selection -->
        <div class="mb-4 text-center">
          <p class="text-lg font-semibold mb-2">Login Method</p>
          <div class="flex space-x-4 justify-center">

            <!-- Username button -->
            <label for="username-radio" class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="username-radio"
                value="username"
                v-model="loginMethod"
                class="hidden"
                @change="updateLoginMethod(true)"
              />
              <div class="flex items-center p-3 border rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300">
                <i class="ri-user-line text-2xl text-gray-500 mr-2"></i>
                <span class="text-sm font-medium">Username</span>
                <div v-if="loginMethod === 'username'" class="ml-2 text-blue-600">
                  <i class="ri-checkbox-circle-fill text-xl"></i>
                </div>
              </div>
            </label>

            <!-- Email button -->
            <label for="email-radio" class="flex items-center cursor-pointer">
              <input
                type="radio"
                id="email-radio"
                value="email"
                v-model="loginMethod"
                class="hidden"
                @change="updateLoginMethod(false)"
              />
              <div class="flex items-center p-3 border rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300">
                <i class="ri-mail-line text-2xl text-gray-500 mr-2"></i>
                <span class="text-sm font-medium">Email</span>
                <div v-if="loginMethod === 'email'" class="ml-2 text-blue-600">
                  <i class="ri-checkbox-circle-fill text-xl"></i>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Login form -->
        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="usernameOrEmail" class="block font-medium mb-1">
              {{ loginMethod === 'email' ? 'Email' : 'Username' }}
              <input
                type="text"
                id="usernameOrEmail"
                v-model="usernameOrEmail"
                required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div class="mb-4">
            <label for="password" class="block font-medium mb-1">
              Password
              <input
                type="password"
                id="password"
                v-model="password"
                required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition">
            Login
          </button>
        </form>
      </div>

      <!-- Redirect to Forgot Password  -->
      <div class="p-2 text-center">
        <a href="/forgot-password/" class="text-blue-600 hover:underline">Forgot Password?</a>
      </div>

      <!-- Redirect to Register -->
      <div class="p-2 mb-2 text-center">
        <p>Don't have an account? <a href="/register/" class="text-blue-600 hover:underline">Register here</a></p>
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

const usernameOrEmail = ref('');
const password = ref('');
const loginMethod = ref('username'); // Default to username
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

const updateLoginMethod = (isUsername) => {
  loginMethod.value = isUsername ? 'username' : 'email';
};

const login = async () => {
  errorMessage.value = '';

  try {
    const payload = {
      [loginMethod.value]: usernameOrEmail.value,
      password: password.value,
      isUsername: loginMethod.value === 'username' // Boolean to indicate login method
    };

    const response = await axios.post('/api/login/', payload, {
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
    errorMessage.value = 'Error logging in';
  }
};
</script>
