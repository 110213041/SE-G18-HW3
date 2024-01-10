<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue"

import * as GlobalState from "../model/global_state"
import * as NewCart from "../controller/cart_new"
import * as Items from "../controller/items"

type _item_t =
  Pick<Items.item_t, "item_id" | "display_name" | "price"> & {
    quantity: number;
  }

const renderCart: Ref<_item_t[]> = ref([]);


async function showCart() {
  const _cart = NewCart.cartItems.value.map(async (v): Promise<_item_t> => {
    const currentItem = await Items.getItemInfo(v.item_id)

    if (currentItem === undefined) {
      throw new Error(`cart: fail to fetch ${v.item_id}`)
    }

    return {
      item_id: v.item_id,
      display_name: currentItem!.display_name,
      price: currentItem!.price,
      quantity: v.quantity
    }
  })
  renderCart.value = await Promise.all(_cart)
}

function calcTotal() {
  let total = 0;
  renderCart.value.forEach((v) => {
    total = total + v.price * v.quantity
  })
  return total
}

async function updateCartItem(itemId: number, quantity: number) {
  if (quantity < 1) return;

  await NewCart.changeItem(itemId, quantity)
}

onMounted(showCart)

</script>

<template>
  <table>
    <template v-for="v in renderCart">
      <tr>
        <td>{{ v.display_name }}</td>
        <td>{{ v.price }}</td>
        <td>{{ v.quantity }}</td>
        <td>
          <button type="button" @click="updateCartItem(v.item_id, v.quantity - 1)">-</button>
        </td>
        <td>
          <button type="button" @click="updateCartItem(v.item_id, v.quantity + 1)">+</button>
        </td>
      </tr>
    </template>

    <tr>
      <td>Total</td>
      <td>{{ calcTotal() }}</td>
    </tr>
  </table>
</template>

