<script lang="ts" setup>
import { ref } from "vue";
import { cartState } from "../controller/cart";

const isShow = ref(false)

function toggleShow() {
  isShow.value = isShow.value ? false : true
}
</script>

<template>
  <button @click="toggleShow">Cart</button>
  <div v-if="isShow">
    <template v-if="cartState.cart.length > 0">
      <div v-for="cartItem in cartState.cart">
        <span>{{ //@ts-ignore
          cartItem.itemId }}</span>
        <button @click="//@ts-ignore
          cartState.updateCartItem(cartItem.itemId, cartItem.quantity + 1)">add 1</button>
        <span class="cart-quantity">{{ //@ts-ignore
          cartItem.quantity }}</span>
        <button @click="//@ts-ignore
          cartState.updateCartItem(cartItem.itemId, cartItem.quantity - 1)">del1</button>
        <button @click="//@ts-ignore
          cartState.removeCartItem(cartItem.itemId)">remove item</button>
      </div>
    </template>
    <template v-else>
      <p>empty cart</p>
    </template>
  </div>
</template>