<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
    <div class="logo mb-6">
      <img src="../assets/logo-mtx.png" alt="Logo-mtx" class="h-32">
    </div>
    <h1 class="text-5xl font-extrabold text-gray-800 mb-4">Welcome to ChatMatrix</h1>
    <p class="text-xl text-gray-600 mb-6">ChatMatrix offers similar capabilities to ChatGPT, focusing on <strong>Sentiment Analysis</strong> , <strong>Summarize Text</strong> , and <strong>Plate Recognition</strong>.</p>
    <br>
    <a href="/dashboard/" class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-500 transition">Start Chatting</a>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>
