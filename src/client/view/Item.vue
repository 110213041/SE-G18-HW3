<script lang="ts" setup>
  import { updateCartItemWrapper } from "../controller/cart";

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
  <h2>Information about item {{ id }}</h2>
  <template v-if="!isLoading">
    <div v-if="resultJson.status === 'success'">
      <div id="itemName">{{ resultJson.result.display_name }}</div>
      <div id="itemPrice">{{ resultJson.result.price }}</div>
      <div id="itemDetails">{{ resultJson.result.description }}</div>
      <div id="itemOwner">{{ resultJson.result.owner_name }}</div>
      <!-- @ts-ignore -->
      <button @click=" //@ts-ignore
        updateCartItemWrapper(resultJson.result.id, 1)"> Add to cart </button>

    </div>
    <div v-else id="notFoundPage">
      <p>Sorry item not found!</p>
    </div>
  </template>
  <template v-else id="loadPage">
    <p>Loading...</p>
  </template>
</template>
<style scoped>
  .page-title {
    font-size: 24px;
    color: #333;
  }

  .item-details {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  #itemName {
    font-size: 20px;
    font-weight: bold;
  }

  #itemPrice {
    margin: 5px;
    color: #e44d26; /* 橙色 */
    font-weight: bolder;
  }

  #itemDetails {
    margin-top: 10px;
  }

  #itemOwner {
    margin-top: 10px;
    font-style: italic;
    font-weight: bolder;
  }

  button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #4caf50;
    color: #fff;
    border: #4caf50 solid 2px;
    border-radius: 5px;
    cursor: pointer;
    transition: .5s;
  }

  button:hover {
    border: #4caf50 solid 2px;
    color: #45a049;
    background-color: #fff;
  }

  .not-found-page {
    margin-top: 20px;
    color: #ff0000; /* 紅色 */
  }

  .loading-page {
    margin-top: 20px;
    color: #3498db; /* 藍色 */
  }
</style>