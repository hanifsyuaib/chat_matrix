<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-6 text-center">
      <h1 class="text-xl font-bold text-blue-600">Logging Out...</h1>
      <p class="mt-4 text-gray-700">Please wait while we log you out.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/logout/', {}, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });
    router.push('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

onMounted(logout);
</script>

<style scoped>

</style>
