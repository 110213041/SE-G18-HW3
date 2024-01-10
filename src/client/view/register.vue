<template>
  <div class="register-container">
    <h2 class="register-title">Register Page</h2>

    <div class="form-group">
      <label for="username">Username:</label>
      <input v-model="username" type="text" id="username" class="form-input" />
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input v-model="email" type="text" id="email" class="form-input" />
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" class="form-input" />
    </div>

    <div class="form-group">
      <label for="shopper">want to be shopper:</label>
      <input v-model="isShopper" type="checkbox" id="shopper" class="form-input" />
    </div>


    <button @click="register" class="register-button">Register</button>

    <router-link to="/login" class="login-link">Go to Login</router-link>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: .3s;
}

.register-button:hover {
  background-color: #45a049;
}

.login-link {
  display: block;
  margin-top: 15px;
  text-align: center;
  color: #007bff;
  text-decoration: none;
}
</style>


<script lang="ts" setup>
import { ref } from "vue"

import { useRouter } from 'vue-router';
import { username, password, email } from "../model/global_state";

const isShopper = ref(false)

// 使用Vue Router的實例
const router = useRouter();

// 註冊方法
const register = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username.value,
        email: email.value,
        password: password.value,
        as_shopper: isShopper.value
      }),
    });

    if (response.ok) {
      // 處理成功註冊的情況
      if (response.status === 201) {
        console.log('Registration successful');
        isShopper.value = false

        // 註冊成功後導向到登入頁面
        router.push('/login');
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } else {
      // 處理註冊失敗的情況
      console.error('Registration failed:', response.statusText);

      // 根據錯誤的HTTP狀態碼處理相應的錯誤訊息
      if (response.status === 403) {
        // 帳戶已存在的錯誤
        alert('Account already exists. Please choose a different username or email.');
      } else if (response.status === 400) {
        // 錯誤的HTTP方法或內容類型
        alert('Wrong HTTP method or content type');
      } else {
        // 其他錯誤，可以根據需要進行處理
        alert('Registration failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
};
</script>
