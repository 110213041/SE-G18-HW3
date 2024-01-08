<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { findHome } from "../model/global_state";

// 全域狀態管理使用者輸入的數據
//const username = ref('');
//const password = ref('');
const loginResponse = ref(null);
// 使用Vue Router的實例
const router = useRouter();

// 登入方法
const login = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // 處理成功登入的回應
      if (data.type === 'login_response') {
        console.log('Login successful:', data.content);

        // 將 user_info 和 session 存儲到相應的變數中
        userId.value = data.content.user_id;
        session.value = data.content.session;
        // console.log('data:', data);
        // console.log('data.content:', data.content);
        // console.log('data.content.user_id:', data.content.user_id);

        // 使用 user_info 和 session 去取得用戶資訊
        const infoResponse = await fetch(`${window.location.origin}/api/account/info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId.value,
            session: session.value,

          }),
        });

        if (infoResponse.ok) {
          const userInfoData = await infoResponse.json();

          // 處理成功取得用戶資訊的回應
          if (userInfoData.type === 'user_info') {
            console.log('User Info:', userInfoData.content);
            const role = userInfoData.content.role;
            console.log('Role:', role);
            if (role) {
              const homePath = findHome(role);
              router.push(homePath);
              } else {
                console.error('Role is undefined or null');
              }


            // const homePath = findHome(userInfo.role);
            // router.push(homePath);
        } else {
          console.error('Failed to get user info:', infoResponse.statusText);
        }
      } else {
        console.error('Unexpected response format:', data);
      }
      } else {
        // 處理登入失敗的情況
        console.error('Login failed:', response.statusText);

        // 根據錯誤的HTTP狀態碼處理相應的錯誤訊息
        if (response.status === 403) {
          // 用戶名或密碼不匹配的錯誤
          alert('Username or password mismatch');
        } else if (response.status === 400) {
          // 錯誤的HTTP方法或內容類型
          alert('Wrong HTTP method or content type');
        }
      }
    }
  } 
  catch (error) {
    console.error('Error during login:', error);
  }
  
};



// 前往註冊頁面的方法
const goToRegister = () => {
  router.push('/register');
};


const logout = async () => {
  username.value = ""
  password.value = ""
  email.value = ""
  userId.value = 0
  session.value = ""
  userInfo.value = undefined
}
</script>


<template>
  <template v-if="userInfo !== undefined">
    <div>hello: {{ userInfo.user_name }}</div>
    <button @click="logout">logout</button>
  </template>
  <!-- <template v-if="role">

  </template> -->
  <div v-else>
    <h2>Login Page</h2>

    <label for="username">Username:</label>
    <input v-model="username" type="text" id="username" />

    <label for="password">Password:</label>
    <input v-model="password" type="password" id="password" />

    <button @click="login">Login</button>

    <router-link to="/register">Go to Regist</router-link>
  </div>
</template>



<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.login-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
