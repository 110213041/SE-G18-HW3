<script lang="ts" setup>
import {
  cartDetailItem,
  isShow,
  toggleShow,
  totalCost,
  updateCartItem,
  removeCartItem,
  initCart
} from "../controller/cart";

import { cart } from "../model/global_state";

import { onMounted } from "vue";

onMounted(initCart);
</script>

<template>
  <button @click="toggleShow">{{ isShow ? "Close" : "Cart" }}</button>
  <div v-if="isShow">
    <template v-if="cart.length > 0">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>name</th>
            <th>price</th>
            <th>quantity</th>
            <th>remove</th>
          </tr>
        </thead>

        <tbody v-for="item in cartDetailItem">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.display_name }}</td>
            <td>$ {{ item.price }}</td>
            <td>
              <button class="cart-del-quantity-btn" @click="updateCartItem(item.id, item.quantity - 1)">-</button>
              <span class="cart-quantity">{{ item.quantity }}</span>
              <button class="cart-add-quantity-btn" @click="updateCartItem(item.id, item.quantity + 1)">+</button>
            </td>
            <td><button class="cart-rm-quantity-btn" @click="removeCartItem(item.id)">remove item</button>
            </td>
          </tr>
        </tbody>
      </table>


    </template>
    <template v-else>
      <p>empty cart</p>
    </template>
    <div>Total: ${{ totalCost }}</div>
  </div>
</template>

<style>
table {
  width: 60%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.cart-quantity {
  margin: 0 5px;
}

.cart-del-quantity-btn,
.cart-add-quantity-btn,
.cart-rm-quantity-btn {
  padding: 8px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
}
</style>
