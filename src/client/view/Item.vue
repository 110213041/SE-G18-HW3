<script lang="ts" setup>
import { cartState } from "../controller/cart";

import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Module
const id = route.params.id as string;

type dbResponse = {
  status: "success";
  result: {
    id: number;
    display_name: string;
    price: number;
    description: string;
    owner_id: number;
    owner_name: string;
  };
} | {
  status: "fail";
  message: string;
};
let resultJson: dbResponse = ref(null);
const isLoading = ref(true);


// Control 
function getData() {
  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("q", id);

  fetch(queryUrl.href)
    .then(res => res.json())
    .then(res => {
      resultJson = res;
      isLoading.value = false;
    })
    .catch(e => {
      console.error(e)
    })
}

getData();
</script>


<!-- View -->
<template>
  <h2>This is Item {{ id }} Page</h2>
  <template v-if="!isLoading">
    <div v-if="resultJson.status === 'success'">
      <div>{{ resultJson.result.display_name }}</div>
      <div>{{ resultJson.result.price }}</div>
      <div>{{ resultJson.result.description }}</div>
      <div>{{ resultJson.result.owner_name }}</div>
      <!-- @ts-ignore -->
      <button @click=" //@ts-ignore
        cartState.updateCartItem(resultJson.result.id, 1)"> add to cart </button>

    </div>


    <div v-else>
      <p>sorry item not found!</p>
    </div>
  </template>
  <template v-else>
    <p>loading</p>
  </template>
</template>
