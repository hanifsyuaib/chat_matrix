<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <div class="bg-blue-600 text-white text-2xl font-bold text-center py-4 rounded-t-lg">Login</div>
      <div class="p-6">
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4" role="alert">{{ errorMessage }}</div>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="username" class="block font-medium mb-1">Username
              <input type="text" id="username" v-model="username" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div class="mb-4">
            <label for="password" class="block font-medium mb-1">Password
              <input type="password" id="password" v-model="password" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition">Login</button>
        </form>
      </div>
      <div class="p-4 text-center">
        <p>Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register here</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const login = async () => {
  errorMessage.value = '';

  try {
    const response = await axios.post('http://127.0.0.1:8000/login', {
      username: username.value,
      password: password.value,
    }, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });

    if (response.data.success) {
      router.push('/chatbot');
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error logging in';
  }
};
</script>

<style scoped>

</style>
