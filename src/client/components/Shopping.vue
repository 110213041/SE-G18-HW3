<script setup lang="ts">
import { type shopping_order_t } from "../controller/order"

import Shipping from './Shipping.vue';

const props = defineProps<{
  value: shopping_order_t
}>()

const shopping = props.value
</script>

<template>
  <section>
    <div>Shopping Id: {{ shopping.id }}</div>
    <template v-for="shipping in shopping.shipping">
      <Shipping :value="shipping"></Shipping>
    </template>
  </section>
</template>

<style scoped>
section {
  border: 1px solid black;
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding: 1rem;
}
</style>