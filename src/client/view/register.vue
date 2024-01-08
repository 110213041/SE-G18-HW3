<template>
  <div>
    <h2>Register Page</h2>

    <label for="username">Username:</label>
    <input v-model="username" type="text" id="username" />

    <label for="email">Email:</label>
    <input v-model="email" type="text" id="email" />

    <label for="password">Password:</label>
    <input v-model="password" type="password" id="password" />

    <button @click="register">Register</button>

    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { username, password, email } from "../model/global_state";
// 全域狀態管理使用者輸入的數據
// const username = ref('');
// const email = ref('');
// const password = ref('');

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
      }),
    });

    if (response.ok) {
      // 處理成功註冊的情況
      if (response.status === 201) {
        console.log('Registration successful');

        // 在這裡你可以處理註冊成功後的相應邏輯

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
