<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isLoading = ref(true);

type item = {
  id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  owner_name: string;
};

let itemArray: item[] = [];

function getData() {
  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "getall");

  fetch(queryUrl.href)
    .then(res => res.json())
    .then(res => {
      itemArray = res.filter(v => v.state === 1);
      isLoading.value = false
    })
}

getData()


</script>

<template>
  <h2>This is Home</h2>
  <template v-if="!isLoading">
    <div id="item-list-wrapper" v-if="itemArray.length > 0">
      <div class="item-wrapper" v-for="currentItem in itemArray">
        <div class="item-name">{{ // @ts-ignore
          currentItem.display_name }}</div>

        <div class="item-price">{{ // @ts-ignore
          currentItem.price }}</div>

        <RouterLink :to=" //@ts-ignore/item/${currentItem.id}>to item "</RouterLink>
      </div>
    </div>
  </template>
</template>
<style >
  .page-title {
    font-size: 24px;
    color: #333;
  }
  #item-list-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .item-wrapper {
    flex: 0 0 30%;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  }
  .item-wrapper:hover {
    transform: scale(1.05);
  }
  .item-name {
    font-size: 18px;
    font-weight: bold;
  }
  .item-price {
    margin-top: 5px;
    color: #e44d26; /* 橙色 */
  }
  RouterLink {
    display: block;
    margin-top: 10px;
    color: #3498db; /* 藍色 */
    text-decoration: none;
  }
  RouterLink:hover {
    text-decoration: underline;
  }

</style>