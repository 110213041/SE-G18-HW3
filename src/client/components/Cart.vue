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
      <div v-for="(_, index) in cartState.cart.length">
        <span>{{ joinResult[0][index].itemId }}</span>
        <span>{{ joinResult[1][index].display_name }}</span>
        <button class="cart-del-quantity-btn" @click="//@ts-ignore
          updateCartItemWrapper(joinResult[0][index].itemId, joinResult[0][index].quantity - 1)">del1</button>
        <span class="cart-quantity">{{ //@ts-ignore
          joinResult[0][index].quantity }}</span>
        <button class="cart-add-quantity-btn" @click="//@ts-ignore
          updateCartItemWrapper(joinResult[0][index].itemId, joinResult[0][index].quantity + 1)">add
          1</button>
        <button class="cart-rm-quantity-btn" @click="//@ts-ignore
          removeCartItemWrapper(joinResult[0][index].itemId)">remove item</button>
      </div>
    </template>
    <template v-else>
      <p>empty cart</p>
    </template>
    <div>Total: ${{ totalCost }}</div>
  </div>
</template>