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
  <button @click="toggleShow">{{ isShow ? "Close" : "Cart" }}</button>
  <div v-if="isShow">
    <template v-if="cartState.cart.length > 0">
      <!-- <div v-for="cartItem in cartState.cart"> -->
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

        <tbody v-for="(_, index) in cartState.cart.length">
          <tr>
          <td>{{ joinResult[0][index].itemId }}</td>
          <td>{{ joinResult[1][index].display_name }}</td>
          <td>$ {{ joinResult[1][index].price }}</td>
          <td>
          <button class="cart-del-quantity-btn" @click="//@ts-ignore
            updateCartItemWrapper(joinResult[0][index].itemId, joinResult[0][index].quantity - 1)">-</button>
          <span class="cart-quantity">{{ //@ts-ignore
            joinResult[0][index].quantity }}</span>
          <button class="cart-add-quantity-btn" @click="//@ts-ignore
            updateCartItemWrapper(joinResult[0][index].itemId, joinResult[0][index].quantity + 1)">+</button>
          </td>
          <td><button class="cart-rm-quantity-btn" @click="//@ts-ignore
            removeCartItemWrapper(joinResult[0][index].itemId)">remove item</button>
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
