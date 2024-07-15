<template>
  <div class="register-container">
    <div class="card">
      <div class="card-header">Register</div>
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" v-model="username" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="password1">Password</label>
            <input type="password" class="form-control" id="password1" v-model="password1" required>
          </div>
          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input type="password" class="form-control" id="password2" v-model="password2" required>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password1 = ref('');
const password2 = ref('');
const errorMessage = ref('');
const router = useRouter();

const register = async () => {
  errorMessage.value = '';

  try {
    const response = await axios.post('/register/', {
      username: username.value,
      email: email.value,
      password1: password1.value,
      password2: password2.value,
    });

    if (response.data.success) {
      router.push(response.data.redirect_url);
    } else {
      errorMessage.value = response.data.error_message;
    }
  } catch (error) {
    errorMessage.value = 'Error creating account';
  }
};
</script>

<style>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.card {
  max-width: 400px;
}
.card-header {
  background-color: #007bff;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.card-body {
  padding: 30px;
}
.form-group {
  margin-bottom: 20px;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}
input[type="text"], input[type="password"] {
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
}
button[type="submit"] {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
button[type="submit"]:hover {
  background-color: #0062cc;
}
.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
