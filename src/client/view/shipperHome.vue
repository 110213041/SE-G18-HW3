<script lang="ts" setup>
import { ref, type Ref, onMounted } from "vue"

import { username } from "../model/global_state";
import { handleLogout } from "../model/global_state";

import Shipping from "../components/Shipping.vue";


import * as Order from "../controller/order"


const allShipment: Ref<Order.shipping_t[]> = ref([])

onMounted(async () => {


  const respShipping = await Order.getAllShippingOrder()
  if (respShipping === undefined) {
    throw new Error("fail to fetch items")
  }

  allShipment.value = respShipping
})


</script>

<template>
  <h2>this is shipper's home</h2>
  <section class="welcome-container">
    <div>Hello: {{ username }}</div>
    <button @click="handleLogout()" class="logout-button">Logout</button>
  </section>

  <section>
    <h2>所有運輸單</h2>
    <template v-for="ship in allShipment">
      <Shipping :value="ship"></Shipping>
    </template>
  </section>
</template>

<style></style>