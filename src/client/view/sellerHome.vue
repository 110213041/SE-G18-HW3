<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import { handleLogout } from "../model/global_state";
import { username, userId } from "../model/global_state";
import { createItem } from "../controller/items"


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

const newName = ref("")
const newPrice = ref(-1)
const newDescription = ref("")

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

    <h3>新增產品</h3>

    <section id="create-new-item">
      <div>
        <span>Item name: </span>
        <input type="text" v-model.trim="newName">
      </div>

      <div>
        <span>Item price: </span>
        <input type="number" v-model="newPrice">
      </div>

      <div>
        <span>Item description: </span>
        <textarea cols="30" rows="10" v-model="newDescription"></textarea>
      </div>

      <button :disabled="newName === '' || newPrice < 0 || newDescription === ''"
        @click="createItem(newName, newPrice, newDescription)">create new item</button>
    </section>

  </section>

  <section>
    <h2>訂單管理</h2>


    <template v-for="ship in allShipment">
      <Shipping :value="ship"></Shipping>
    </template>
  </section>
</template>

<style scoped>
section [id="create-new-item"] {
  border: 1px solid grey;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
}
</style>