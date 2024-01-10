<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as Items from '../controller/items';
import * as NewCart from '../controller/cart_new';
import * as GlobalState from "../model/global_state"

const route = useRoute();
const id = route.params.id as unknown as number;

// let itemArray: Ref<item_t[]> = ref([]);

const itemValue: Ref<Items.item_t | undefined> = ref()

async function getData() {
  const resp = await Items.getItemInfo(id);
  itemValue.value = resp
}

onMounted(getData);

function isValidClient() {
  const userInfo = GlobalState.userInfo.value;

  if (userInfo === undefined) return true;

  return !(!userInfo.role.seller && !userInfo.role.shipper)
}


</script>


<!-- View -->
<template>
  <h2>This is Item {{ id }} Page</h2>

  <table>
    <tr>
      <td>Name: </td>
      <td>{{ itemValue?.display_name }}</td>
    </tr>
    <tr>
      <td>Price: </td>
      <td>{{ itemValue?.price }}</td>
    </tr>
    <tr>
      <td>Description: </td>
      <td>{{ itemValue?.description }}</td>
    </tr>
  </table>

  <button type="button" :disabled="isValidClient()" @click="NewCart.changeItem(id, 1)">add to cart</button>
</template>

<style></style>
