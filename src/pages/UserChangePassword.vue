<template>
  <div class="flex flex-col p-6 items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <div class="bg-blue-600 text-white text-2xl font-bold text-center py-4 rounded-t-lg">Change Password</div>
      <div class="p-6">
        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4" role="alert">{{ errorMessage }}</div>
        <form @submit.prevent="changePassword">
          <div class="mb-6">
            <label for="oldPassword" class="block font-medium mb-1">Current Password
              <input type="password" id="oldPassword" v-model="oldPassword" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div class="mb-6">
            <label for="newPassword" class="block font-medium mb-1">New Password
              <input type="password" id="newPassword" v-model="newPassword" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div class="mt-1 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
                <i class="ri-lock-line mr-2"></i>
                Your password must be at least 8 characters long and include:
                <ul class="list-disc pl-5">
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One digit</li>
                  <li>One special character</li>
                </ul>
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label for="confirmNewPassword" class="block font-medium mb-1">Confirm New Password
              <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" required class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div class="mt-1 p-2 bg-orange-100 border-l-4 border-orange-500 text-orange-700 rounded">
                <i class="ri-repeat-line mr-2"></i>
                Re-enter your password to confirm.
              </div>
            </label>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition">Change Password</button>
        </form>
      </div>
    </div>

    <!-- Dashboard Button -->
    <div class="mt-16">
      <button @click="dashboard" class="bg-blue-100 text-blue-500 font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300 hover:bg-blue-500 hover:text-white">
        Return to Dashboard
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

const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
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

const changePassword = async () => {
  errorMessage.value = '';

  try {
    const payload = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    };

    const response = await axios.post('/api/change-password/', payload, {
      headers: {
        'X-CSRFToken': csrftoken.value,
      },
    });

    if (response.data.success) {
      // error_message value is 'Password has been successfully changed'
      errorMessage.value = response.data.error_message;
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error changing password';
  }
};

const dashboard = () => {
  router.push('/dashboard/');
};
</script>
