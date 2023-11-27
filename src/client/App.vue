<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Cart from './components/Cart.vue';

</script>

<template>
  <h1>Testing from App.vue</h1>
  <Cart></Cart>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/seller">Seller</router-link>
  </nav>
  <RouterView></RouterView>
</template>

<style>
nav {
  display: flex;
  gap: 10px; 
}
</style>