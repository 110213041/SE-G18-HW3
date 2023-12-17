<script lang="ts" setup>
import { ref, onMounted } from 'vue';
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

type dbResponse = item & { state: number };

let itemArray: item[] = [];

async function getData() {
  isLoading.value = true

  const queryUrl = new URL(location.origin);
  queryUrl.pathname = "/api/item";
  queryUrl.searchParams.set("a", "getall");

  try {
    const resp = await fetch(queryUrl.href);
    const respJson: dbResponse[] = await resp.json();

    itemArray = respJson.filter(v => v.state === 1);
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

onMounted(getData)

</script>

<template>
  <h2>This is Home</h2>
  <template v-if="!isLoading">
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
              <RouterLink :to="`/item/${currentItem.id}`">to item</RouterLink>
            </td>

          </tbody>
        </table>
      </div>
    </div>
  </template>
</template>
<style scoped>
/* styles.css */

/* Reset some default margin and padding */
body, h2, table {
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