<template>
  <div>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>Login</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    </head>
    <body>
      <div class="login-container">
        <div class="card">
          <div class="card-header">Login</div>
          <div class="card-body">
            <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" v-model="username" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
          </div>
          <div class="card-footer">
            <p>Don't have an account? <a href="/register">Register here</a></p>
          </div>
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </body>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = () => {
  // Add form submission logic here
  // For example, send a request to the backend API for login
};
</script>

<style>
body {
  background-color: #f0f0f0;
}
.login-container {
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
input[type="text"],
input[type="password"] {
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
.card-footer {
  padding: 10px;
  background-color: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.card-footer p {
  margin: 0;
  font-size: 14px;
  text-align: center;
}
.card-footer a {
  color: #007bff;
  text-decoration: none;
}
.card-footer a:hover {
  text-decoration: underline;
}
</style>
