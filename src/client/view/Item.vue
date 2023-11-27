<script lang="ts" setup>
import { updateCartItemWrapper, cartState } from "../controller/cart";
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
      <table >
        <thead>
          <th colspan="2">Item {{ id }}</th>
        </thead>
        <tbody>
          <tr><td>name</td><td>{{ resultJson.result.display_name }}</td></tr>
          <tr><td>price</td><td>{{ resultJson.result.price }}</td></tr>
          <tr><td>description</td><td>{{ resultJson.result.description }}</td></tr>
          <tr><td>seller</td><td>{{ resultJson.result.owner_name }}</td></tr>
        </tbody>

        <button @click=" //@ts-ignore
          updateCartItemWrapper(resultJson.result.id, cartState.cart.findIndex(v => v.itemId === resultJson.result.id) === -1 ? 1 : cartState.cart.find(v => v.itemId === resultJson.result.id).quantity + 1
          )"> add to cart </button>
      </table>

    </div>


    <div v-else>
      <p>sorry item not found!</p>
    </div>
  </template>
  <template v-else>
    <p>loading</p>
  </template>
</template>
<style>

</style>

