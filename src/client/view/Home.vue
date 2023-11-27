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
      <div class="item-wrapper" >
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
            <td>{{currentItem.price }}</td>
            <td><RouterLink :to=" //@ts-ignore
              `/item/${currentItem.id}`">to item</RouterLink></td>

            </tbody>
        </table>
      </div>
    </div>
  </template>
</template>