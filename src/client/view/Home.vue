<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue';
import { RouterLink } from 'vue-router';

import { getAllItems, type item_t } from "../controller/items"

let itemArray: Ref<item_t[]> = ref([]);

async function getData() {
  const resp = await getAllItems()
  if (resp === undefined) {
    throw new Error("getAllItems response undefined")
  }
  itemArray.value = resp
}

onMounted(getData)

</script>

<template>
  <h2>商品列表</h2>
  <div id="item-list-wrapper" v-if="itemArray.length > 0">
    <div class="item-wrapper">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>price</th>
            <th></th>
          </tr>
        </thead>

        <tbody v-for="currentItem in itemArray">
          <td>{{ currentItem.display_name }}</td>
          <td>{{ currentItem.price }}</td>
          <td>
            <RouterLink :to="`/item/${currentItem.item_id}`">to item</RouterLink>
          </td>

        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
/* styles.css */

/* Reset some default margin and padding */
body,
h2,
table {
  margin: 0;
  padding: 0;
}

/* Style for the item list wrapper */
#item-list-wrapper {
  margin-top: 20px;
}

/* Style for the item wrapper */
.item-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

/* Style for the table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

/* Style for table headers */
th {
  background-color: #f2f2f2;
  padding: 10px;
}

/* Style for table cells */
td {
  border: 1px solid #ddd;
  padding: 10px;
}

/* Style for the "to item" link */
td a {
  display: block;
  text-align: center;
  text-decoration: none;
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>