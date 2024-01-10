<script lang="ts" setup>
import NewCart from '../components/NewCart.vue';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { username, password, email, userId, session, userInfo } from "../model/global_state";
import { handleLogout } from "../model/global_state";
import * as CartNew from "../controller/cart_new";
import {
  checkout,
  resetCart,
  changeItem,
  delItem,
} from '../controller/cart_new';
const router = useRouter();
const cartItems = CartNew.cartItems;

const resetCart = CartNew.resetCart;
const submitCart = CartNew.checkout;

onMounted(() => {
  CartNew.fetchCartData();
});

const goShopping = () => {
  router.push('/item.vue');
};
</script>

<template>
  <template v-if="userId !== undefined">
    <div class="welcome-container">
      <div>Hello: {{ username }}</div>
      <button @click="handleLogout()" class="logout-button">Logout</button>
    </div>
  </template>
  <div>
    <h2>Your Cart</h2>
    <!-- <ul>
      <li v-for="item in cartItems" :key="item.itemId">
        Item ID: {{ item.item_id }} - Quantity: {{ item.quantity }}
      </li>
    </ul> -->
    <NewCart></NewCart>

    <table>
      <thead>
        <tr>
          <th></th>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.item_id">
          {{ item.item_id }} - {{ item.quantity }}
          <td>{{ item.item_id }}</td>
          <td>{{ item.display_name }}</td>
          <td>${{ item.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button @click="changeItem(item.item_id, item.quantity - 1)">+</button>
            <button @click="changeItem(item.item_id, item.quantity + 1)">-</button>
            <button @click="delItem(item.item_id)">移除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <button @click="resetCart()">清空</button>
  <button @click="checkout()">結帳</button>
  <div>
    <h2>採購專區</h2>

  </div>
</template>
