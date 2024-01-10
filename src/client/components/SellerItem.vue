<script setup lang="ts">
import { ref, type Ref } from "vue"
import { item_t, modifyItemStatus } from '../controller/items';

const props = defineProps<{ value: item_t }>()

const item = props.value

const name = ref(item.display_name)
const price = ref(item.price)
const description = ref(item.description)


</script>

<template>
  <section>
    <div>
      <span>Item name: </span>
      <input type="text" v-model.trim="name">
      <button @click="modifyItemStatus(item.item_id, 'display_name', name)">update name</button>
    </div>

    <div>
      <span>Item price: </span>
      <input type="number" v-model="price">
      <button @click="modifyItemStatus(item.item_id, 'price', price)">update price</button>
    </div>

    <div>
      <span>Item description: </span>
      <textarea cols="30" rows="10" v-model="description"></textarea>
      <button @click="modifyItemStatus(item.item_id, 'description', description)">update description</button>
    </div>
  </section>
</template>

<style scoped>
section {
  border: 1px solid grey;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
}
</style>