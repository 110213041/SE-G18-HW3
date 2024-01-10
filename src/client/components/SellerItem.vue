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
      <input type="text" v-model.trim="name">
      <!-- <button @click="modifyItemStatus(item.item_id, 'display_name', name)">update Name</button> -->
    </div>

    <input type="number" v-model="price">

    <textarea cols="30" rows="10" v-model="description"></textarea>


  </section>
</template>