<template>
  <div class="flex flex-col p-6 items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <div class="bg-blue-600 text-white text-2xl font-bold text-center py-4 rounded-t-lg">Forgot Password</div>
      <div class="p-6">

        <!-- Message -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4" role="alert">{{ errorMessage }}</div>
        <div v-if="successMessage" class="bg-green-100 text-green-700 p-2 rounded mb-4" role="alert">{{ successMessage }}</div>

        <!-- Forgot Password Form-->
        <form @submit.prevent="forgotPassword">
          <div class="mb-6">
            <label for="email" class="block font-medium mb-1">Email
              <input type="email" id="email" v-model="email" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div class="mt-1 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
                <i class="ri-mail-line mr-2"></i>
                Enter your exact email that you have registered to your account. We will email you to help remember your password :)
              </div>
            </label>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition">Send email</button>
        </form>
      </div>

      <!-- Contact Us -->
      <div class="p-2 mb-2 text-center">
        <p>Still have issue? </p>
        <p class="text-blue-700">Contact us: {{ emailContact }}</p>
      </div>
    </div>

    <!-- Login Button -->
    <div class="mt-16">
      <button @click="login" class="bg-blue-100 text-blue-500 font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300 hover:bg-blue-500 hover:text-white">
        Return to Login page
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

axios.defaults.withCredentials = true;
const baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.baseURL = baseURL;
const emailContact = process.env.VUE_APP_EMAIL_CONTACT;

const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
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

const forgotPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload = {
      email: email.value,
    };

    const response = await axios.post('/api/forgot-password/', payload, {
      headers: {
        'X-CSRFToken': csrftoken.value,
      },
    });

    if (response.data.success) {
      successMessage.value = response.data.success_message;
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error sending email';
  }
};

const login = () => {
  router.push('/login/');
};
</script>
