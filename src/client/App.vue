<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Cart from './components/Cart.vue';

</script>

<template>
  <Cart></Cart>
  <nav>
    <router-link to="/login">login</router-link>
    <router-link to="/">Home</router-link>
    <router-link to="/register">register</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/seller">Seller</router-link>
    <router-link to="/sellerHome">Seller</router-link>
    <router-link to="/clientHome">client</router-link>
    <router-link to="/shipperHome">shipper</router-link>
  </nav>
  <RouterView></RouterView>
</template>

<style>
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
</style>