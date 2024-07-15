<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header">Login</div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" v-model="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" v-model="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="card-footer">
        <p>Don't have an account? <a href="/register">Register here</a></p>
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
    const response = await axios.post('/login/', {
      username: username.value,
      password: password.value,
    }, {
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    });

    if (response.data.success) {
      router.push(response.data.redirect_url);
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error logging in';
  }
};
</script>

<style>

</style>
