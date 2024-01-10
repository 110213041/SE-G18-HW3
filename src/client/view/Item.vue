<script lang="ts" setup>
import { Ref, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as Items from '../controller/items';
import { changeItem } from '../controller/cart_new';
import { getItemInfo, type item_t ,type requestInfo} from "../controller/items"

const route = useRoute();
const id = route.params.id as unknown as number;

let itemArray: Ref<item_t[]> = ref([]);

async function getData() {
  const resp = await getItemInfo(id);
  resultJson.value = resp;
  isLoading.value = false;
  if (resp === undefined) {
    throw new Error("getItemInfo response undefined")
  }
  itemArray.value = resp
}

// Module

type dbResponse = {
  status: 'success';
  result: {
    id: number;
    display_name: string;
    price: number;
    description: string;
    owner_id: number;
    owner_name: string;
  };
} | {
  status: 'fail';
  message: string;
};
const resultJson = ref<dbResponse>({ status: 'fail', message: '' });
const isLoading = ref(true);
onMounted(getData);
</script>


<!-- View -->
<template>
  <h2>This is Item {{ id }} Page</h2>
  <template v-if="!isLoading">
    <div v-if="resultJson.status === 'success'">
      <table>
        <thead>
          <th colspan="2">Item {{ id }}</th>
        </thead>
        <tbody>
          <tr>
            <td>Item Name:</td>
            <td>{{ resultJson.result.display_name }}</td>
          </tr>
          <tr>
            <td>Price:</td>
            <td>{{ resultJson.result.price }}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{{ resultJson.result.description }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="changeItem(itemArray.id , 1)">Add to Cart</button>
    </div>
    <div v-else>
      <p>Sorry, item not found!</p>
    </div>
  </template>
  <template v-else>
    <p>Loading...</p>
  </template>
</template>

<style></style>
