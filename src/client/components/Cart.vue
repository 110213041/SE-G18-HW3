<script lang="ts" setup>
// import { cartState } from "../controller/cart";
import {
  cartState,
  isShow,
  toggleShow,
  totalCost,
  updateCartItemWrapper,
  removeCartItemWrapper,
  joinResult
} from "../controller/cart";
</script>
<template>
  <div>
    <button @click="toggleShow">{{ isShow ? "Close" : "Cart" }}</button>
    <div v-if="isShow">
      <template v-if="cartState.cart.length > 0">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cartItem, index) in cartState.cart" :key="cartItem.itemId">
              <td>{{ joinResult[0][index].itemId }}</td>
              <td>{{ joinResult[1][index].display_name }}</td>
              <td>$ {{ joinResult[1][index].price }}</td>
              <td>
                <button class="cart-btn" @click="updateCartItem(joinResult[0][index].itemId, -1)">-</button>
                <span class="cart-quantity">{{ joinResult[0][index].quantity }}</span>
                <button class="cart-btn" @click="updateCartItem(joinResult[0][index].itemId, 1)">+</button>
              </td>
              <td>
                <button class="cart-btn" @click="removeCartItem(joinResult[0][index].itemId)">Remove Item</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <p>Empty Cart</p>
      </template>

      <div>Total: ${{ totalCost }}</div>
    </div>
  </div>
</template>

<style>
  table {
    width: 60%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
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
