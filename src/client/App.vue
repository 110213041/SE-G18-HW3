<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Cart from './components/Cart.vue';

</script>

<template>
  <div>
    <Cart class="cart"></Cart>
    <nav class="navbar">
      <router-link to="/login">Login</router-link>
      <router-link to="/">Home</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/seller">Seller</router-link>
      <router-link to="/sellerHome">Seller Home</router-link>
      <router-link to="/clientHome">Client Home</router-link>
      <router-link to="/shipperHome">Shipper Home</router-link>
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
