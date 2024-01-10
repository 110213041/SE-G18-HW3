<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import { handleLogout } from "../model/global_state";
import { username, userId } from "../model/global_state";

import * as Items from '../controller/items';
import * as Order from "../controller/order"

import SellerItem from "../components/SellerItem.vue"
import Shipping from '../components/Shipping.vue';

const allItem: Ref<Items.item_t[]> = ref([])
const allShipment: Ref<Order.shipping_t[]> = ref([])

onMounted(async () => {
  const respItem = await Items.getAllItems()
  if (respItem === undefined) {
    throw new Error("fail to fetch items")
  }

  allItem.value = allItem.value = respItem?.filter((v) => v.owner_id === userId.value)


  const respShipping = await Order.getAllShippingOrder()
  if (respShipping === undefined) {
    throw new Error("fail to fetch items")
  }

  allShipment.value = respShipping.filter(v => v.seller_id === userId.value)
})

</script>

<template>
  <div class="welcome-container">
    <div>Hello: {{ username }}</div>
    <button @click="handleLogout()" class="logout-button">Logout</button>
  </div>

  <section>
    <h2>商品管理</h2>

    <template v-for="item in allItem">
      <SellerItem :value="item"></SellerItem>
    </template>

  </section>

  <section>
    <h2>訂單管理</h2>


    <template v-for="ship in allShipment">
      <Shipping :value="ship"></Shipping>
    </template>
  </section>
</template>
