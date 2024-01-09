<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { handleLogout} from "../model/global_state";
import{
  fetchCartData,
  resetCart,
  changeItem,
  delItem,
  checkout,
  cartItems,
  orderId,
} from "../controller/cart_new";
import { 
  getRate,
  giveRate,
} from "../controller/order";
</script>

<template>
  <template v-if="userId !== undefined">
    <div class="welcome-container">
      <div>Hello: {{ username }}</div>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </template>
  <!-- <div>
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cartItems" :key="item.itemId">
        Item ID: {{ item.item_id }} - Quantity: {{ item.quantity }}
      </li>
    </ul>
    <button @click="resetCart()">清空</button>
    <button @click="checkout()">結帳</button>
  </div> -->
  <div>
    <h2>Shopping Cart</h2>

    <table>
      <thead>
        <tr>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.item_id">
          <!-- <td>{{ item.item_id }}</td>
          <td>{{ item.display_name }}</td>
          <td>${{ item.price }}</td>
          <td>{{ item.quantity }}</td> -->
          <td>
            <button @click="changeItem(item.item_id, item.quantity - 1)">Decrease</button>
            <button @click="changeItem(item.item_id, item.quantity + 1)">Increase</button>
            <button @click="delItem(item.item_id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <button @click="checkout()">Checkout</button>
      <button @click="resetCart()">Clear Cart</button>
    </div>
  </div>
</template>
