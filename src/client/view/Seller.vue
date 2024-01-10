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
  <div class="seller-page-container">
    <h2>Seller Page</h2>
    <p id="note">Note: If you want to change, just enter and press the enter key.</p>

    <div v-if="!isLoading">
      <h3 id="EDZone">Edit Zone</h3>
      <div id="exitGoods">
        <div class="exist-item-wrapper" v-for="(item, idx) in fetchResult" :key="idx">
          <ItemExist :id="item.id" :display_name="item.display_name" :price="item.price" :description="item.description"
            @update-item="getData" class="goods"/>
        </div>
      </div>
    </div>

    <div class="new-item-wrapper">
      <h3 id="CREZone">Create new items</h3>
      <div class="form-group">
        <label for="newItemTitle">Item Name:</label>
        <input type="text" v-model="newItemTitle" id="newItemTitle" required>
      </div>

      <div class="form-group">
        <label for="newItemPrice">Price:</label>
        <input type="number" v-model="newItemPrice" id="newItemPrice" required>
      </div>

      <div class="form-group">
        <label for="newItemDescription">Description:</label>
        <textarea v-model="newItemDescription" id="newItemDescription" cols="30" rows="10"></textarea>
      </div>

      <button ref="newItemSubmitBtn" @click="submitNewItem" class="submit-button">Add Item to Market</button>
    </div>
  </div>
</template>

<style scoped>
.seller-page-container {
  max-width: 80%;
}

h2 {
  font-size: 28px;
  margin-bottom: 15px;
}

h3 {
  font-size: 23px;
  margin-bottom: 15px;
}

p {
  margin-bottom: 20px;
  font-size: larger;
}

#EDZone {
  position: relative;
  left: 50%;
}

#exitGoods {
  display: flex;
  gap: 50px;
}
.exist-item-wrapper {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  width: 40%;
  padding: 5px;
  border: 3px solid greenyellow;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(115, 235, 46, 0.8);
}

.goods {
  flex: 1;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s ease-in-out;
}

.new-item-wrapper {
  margin-top: 30px;
  width: 60%;
  padding: 8px;
  position: relative;
  left: 35%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#CREZone {
  display: grid;
  place-items: center;
}
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}
</style>