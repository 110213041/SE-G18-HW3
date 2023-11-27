<script lang="ts" setup>
import { Ref, ref } from 'vue';
// import { type item } from '../controller/cart';

const SELLER_ID = 2

const isLoading = ref(true)
const fetchResult = ref([])

async function getData() {
  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "getall");

  const resp = await fetch(queryUrl.href);
  const respJson = await resp.json();

  fetchResult.value = await respJson.filter(v => v.owner_id === SELLER_ID)
  isLoading.value = false
}

async function postTemplate(payload: string) {
  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "alter");

  await fetch(queryUrl.href, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    }, body: payload
  })

}
async function onSubmitNameHandler(e: Event, id: number) {
  // @ts-ignore
  if (e.target.value === "" || Number.isNaN(e.target.value)) return;
  // @ts-ignore
  if (!confirm(`Are you sure want to change Display Name ${e.target.value}`)) return;
  // @ts-ignore
  await postTemplate(JSON.stringify({
    id: id,
    // @ts-ignore
    display_name: e.target.value
  }));

  await getData();
  // @ts-ignore
  e.target.value = ""
}

async function onSubmitPriceHandler(e: Event, id: number) {
  // @ts-ignore
  if (e.target.value === "" || Number.isNaN(e.target.value)) return;
  // @ts-ignore
  if (!confirm(`Are you sure want to change price ${e.target.value}`)) return;
  // @ts-ignore
  await postTemplate(JSON.stringify({
    id: id,
    // @ts-ignore
    price: parseInt(e.target.value)
  }));

  await getData();
  // @ts-ignore
  e.target.value = ""
}

async function onSubmitDescriptionHandler(e: Event, id: number) {
  // @ts-ignore
  if (e.target.value === "" || Number.isNaN(e.target.value)) return;
  // @ts-ignore
  if (!confirm(`Are you sure want to change description ${e.target.value}`)) return;
  // @ts-ignore
  await postTemplate(JSON.stringify({
    id: id,
    // @ts-ignore
    description: e.target.value
  }));

  await getData();
}

async function onDeleteBtnHandler(id: number) {
  if (!confirm(`Are you sure want to delete ${id}`)) return;

  await postTemplate(JSON.stringify(
    {
      id: id,
      state: 0
    }
  ))

  await getData();
}

const newItemTitle: Ref<HTMLInputElement> = ref(null);
const newItemPrice: Ref<HTMLInputElement> = ref(null);
const newItemDescription: Ref<HTMLInputElement> = ref(null);
const newItemSubmitBtn: Ref<HTMLButtonElement> = ref(null);
function foo() {
  console.log(newItemTitle.value.value)
}

async function submitNewItem() {
  if (newItemTitle.value.value === "") { alert("Please fill Display name"); return; }
  if (newItemPrice.value.value === "" || Number.isNaN(newItemPrice.value.value)) { alert("Please fill price"); return; }

  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "create");

  await fetch(queryUrl.href, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    }, body: JSON.stringify({
      owner_id: SELLER_ID,
      display_name: newItemTitle.value.value,
      price: parseInt(newItemPrice.value.value),
      description: newItemDescription.value.value
    })
  })
  await getData();

  newItemTitle.value.value = "";
  newItemPrice.value.value = "";
  newItemDescription.value.value = "";
}

getData()
</script>

<template>
  <h2>Seller Page</h2>
  Note:If you want to change, just enter and press the enter key. 
  <div v-if="!isLoading">
    <h3>Edit Zone</h3>
    <div id="exist-item-wrapper" v-for="(item, idx) in fetchResult">
      <span>Display Name: <input type="text" :placeholder=item.display_name
          @keypress.enter="onSubmitNameHandler($event, fetchResult[idx].id)">{{ item.display_name }}</span>

      <span>Price: <input type="number" :placeholder=item.price
          @keypress.enter="onSubmitPriceHandler($event, fetchResult[idx].id)" /> </span>

      <span>Description: <textarea cols="30" rows="10" :placeholder=item.description
          @keypress.enter="onSubmitDescriptionHandler($event, fetchResult[idx].id)">{{ item.description }}</textarea></span>

      <button @click="onDeleteBtnHandler(fetchResult[idx].id)" :disabled="!fetchResult[idx].state">delete item</button>
    </div>
  </div>

  <div id="new-item=wrapper">
    <h3>Create Zone</h3>
    <span>
      Display Name: <input type="text" ref="newItemTitle" required>
    </span>
    <span>
      Price: <input type="number" ref="newItemPrice" required>
    </span>
    <span>Description: <textarea ref="newItemDescription" cols="30" rows="10"></textarea></span>
    <button ref="newItemSubmitBtn" @click="submitNewItem">add item to market</button>
  </div>
</template>