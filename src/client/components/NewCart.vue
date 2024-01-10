<script setup lang="ts">
import * as GlobalState from "../model/global_state"
import * as NewCart from "../controller/cart_new"
import * as Items from "../controller/items"


</script>

<template>
  <table>
    <template v-for="v in NewCart.cartItems.value">
      <tr>
      </tr>
    </template>
  </table>
</template>