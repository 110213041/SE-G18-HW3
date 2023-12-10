<script lang="ts" setup>
import { defineProps, defineEmits, ref } from "vue"

const props = defineProps<{
  id: number,
  display_name: string,
  price: number
  description: string
}>()

/* Model */

const id = ref(props.id)
const displayName = ref(props.display_name)
const price = ref(props.price)
const description = ref(props.description)

/* Controller */

const emit = defineEmits(["updateItem"])

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

async function onSubmitNameHandler() {
  if (!confirm(`Are you sure want to change Display Name ${displayName.value}?`)) return;

  await postTemplate(JSON.stringify({
    id: id.value,
    display_name: displayName.value
  }))

  emit("updateItem")
}

async function onSubmitPriceHandler() {
  if (!confirm(`Are you sure want to change price ${price.value}?`)) return;

  await postTemplate(JSON.stringify({
    id: id.value,
    price: parseInt(price.value.toString())
  }))

  emit("updateItem")
}

async function onSubmitDescriptionHandler() {
  if (!confirm(`Are you sure want to change description?`)) return;

  await postTemplate(JSON.stringify({
    id: id.value,
    description: description.value
  }))

  emit("updateItem")
}

</script>

<!-- View -->

<template>
  <div class="col-id">
    {{ id }}
  </div>

  <div class="col-display-name">
    <input type="text" v-model.trim="displayName" :placeholder="displayName" required>
    <button type="button" @click="onSubmitNameHandler" :disabled="displayName === props.display_name">Update Name</button>
  </div>

  <div class="col-price">
    <input type="number" v-model.number="price" :placeholder="price.toString()" required>
    <button type="button" @click="onSubmitPriceHandler" :disabled="price === props.price">Update Price</button>
  </div>

  <div class="col-description">
    <textarea cols="30" rows="10" v-model.trim="description" :placeholder="description">{{ description }}</textarea>
    <button type="button" @click="onSubmitDescriptionHandler" :disabled="description === props.description">
      Update Description
    </button>
  </div>
</template>

<style>
.wrapper {
  display: grid;
}
</style>