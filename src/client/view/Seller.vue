<script lang="ts" setup>
import ItemExist from '../components/ItemExist.vue';
import { type Ref, ref, onMounted, onUpdated } from 'vue';

type item = {
  id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  owner_name: string;
};

type dbResponse = item & { state: number }

/* Model */

// TODO: Remove after implement session
const SELLER_ID = 2

const isLoading = ref(true)
const fetchResult: Ref<dbResponse[]> = ref([])

const newItemTitle = ref("");
const newItemPrice = ref("");
const newItemDescription = ref("");
const newItemSubmitBtn = ref(null);

/* Controller */

async function getData() {
  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "getall");

  const resp = await fetch(queryUrl.href);
  const respJson = await resp.json();

  fetchResult.value = await respJson.filter((v: item) => v.owner_id === SELLER_ID)
  isLoading.value = false
}

async function submitNewItem() {
  if (newItemTitle.value === "") { alert("Please fill Display name"); return; }
  if (newItemPrice.value === "" || Number.isNaN(newItemPrice.value)) { alert("Please fill price"); return; }


  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "create");

  try {
    await fetch(queryUrl.href, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      }, body: JSON.stringify({
        owner_id: SELLER_ID,
        display_name: newItemTitle.value,
        price: parseInt(newItemPrice.value),
        description: newItemDescription.value
      })
    })
  } catch (e) {
    console.error(e);
  }

  await getData();

  newItemTitle.value = "";
  newItemPrice.value = "";
  newItemDescription.value = "";
}

onMounted(getData)
</script>

<!-- View -->

<template>
  <h2>Seller Page</h2>
  Note:If you want to change, just enter and press the enter key.
  <div v-if="!isLoading">
    <h3>Edit Zone</h3>
    <div id="exist-item-wrapper" v-for="(item, idx) in fetchResult">
      <ItemExist :id="item.id" :display_name="item.display_name" :price="item.price" :description="item.description"
        @update-item="getData" />
    </div>
  </div>

  <div id="new-item=wrapper">
    <h3>Create new items</h3>
    <span>
      Item Name: <input type="text" v-model="newItemTitle" required>
    </span>
    <span>
      Price: <input type="number" v-model="newItemPrice" required>
    </span>
    <span>Description: <textarea v-model="newItemDescription" cols="30" rows="10"></textarea></span>
    <button ref="newItemSubmitBtn" @click="submitNewItem">add item to market</button>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 24px;
  color: #333;
}

#edit-zone-title {
  font-size: 20px;
  margin-top: 20px;
}

#exist-item-wrapper {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

#edit-field {
  display: block;
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

#new-item-wrapper {
  margin-top: 20px;
}
</style>