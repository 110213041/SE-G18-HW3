<script lang="ts" setup>
import { RouterView } from 'vue-router';
import * as GlobalState from "./model/global_state"
</script>

<template>
  <div>
    <nav class="navbar">
      <router-link to="/login">Login</router-link>
      <router-link to="/">Item Page</router-link>
      <router-link v-if="GlobalState.userInfo.value === undefined" to="/register">Register</router-link>
      <router-link v-if="GlobalState.userInfo.value?.role.seller" to="/sellerHome">Seller Home</router-link>
      <router-link
        v-if="GlobalState.userInfo.value?.role.seller === false && GlobalState.userInfo.value?.role.shipper === false"
        to="/clientHome">Client Home</router-link>
      <router-link v-if="GlobalState.userInfo.value?.role.shipper" to="/shipperHome">Shipper Home</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

.navbar {
  background-color: #333;
  overflow: hidden;
  margin-bottom: 20px;
}

.navbar a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  transition: .3s;
}

.navbar a:hover {
  background-color: #ddd;
  color: black;
}

.navbar a.active {
  background-color: #4CAF50;
  color: white;
}
</style>

<!-- <style>
/* 
* Content box and Border box will change how box size work. 
* DO NOT CHANGE.
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

nav {
  display: flex;
  gap: 10px;
}
</style> -->
