<script lang="ts" setup>
import NewCart from '../components/NewCart.vue';

import { ref, onMounted, type Ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as GlobalState from "../model/global_state";
import { handleLogout } from "../model/global_state";
import * as CartNew from "../controller/cart_new";
import {
  checkout,
  resetCart,
  changeItem,
  delItem,
} from '../controller/cart_new';

import Shopping from '../components/Shopping.vue';

import * as Items from "../controller/items"
import * as Order from "../controller/order"

const cartItems = CartNew.cartItems;

type _item_t =
  Pick<Items.item_t, "item_id" | "display_name" | "price"> & {
    quantity: number;
  }

const renderCart: Ref<_item_t[]> = ref([]);
const renderTotalCost: Ref<number> = ref(0)

async function showCart() {
  const _cart = CartNew.cartItems.value.map(async (v): Promise<_item_t> => {
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

function calcTotal(target: Ref<number>) {
  let total = 0;
  renderCart.value.forEach((v) => {
    total = total + v.price * v.quantity
  })

  target.value = total

  return total
}

const shoppingOrder: Ref<Order.shopping_order_t[]> = ref([])

watch(cartItems, async () => {
  await showCart()
  calcTotal(renderTotalCost)
})

onMounted(async () => {
  await CartNew.fetchCartData();
  await showCart()

  const _shippingOrder = await Order.getAllShoppingOrder()
  if (_shippingOrder === undefined) throw new Error("fail to fetch shipping order")
  shoppingOrder.value = _shippingOrder
});
</script>

<template>
  <template v-if="GlobalState.userId !== undefined">
    <div class="welcome-container">
      <div>Hello: {{ GlobalState.username }}</div>
      <button @click="handleLogout()" class="logout-button">Logout</button>
    </div>
  </template>
  <div>
    <h2>Your Cart</h2>

    <table>
      <thead>
        <tr>
          <th></th>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in renderCart" :key="item.item_id">
          {{ item.item_id }} - {{ item.quantity }}
          <td>{{ item.item_id }}</td>
          <td>{{ item.display_name }}</td>
          <td>${{ item.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button @click="changeItem(item.item_id, item.quantity - 1)">-</button>
            <button @click="changeItem(item.item_id, item.quantity + 1)">+</button>
            <button @click="delItem(item.item_id)">移除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div>
    <span>總額: </span>
    <span>{{ renderTotalCost }}</span>
  </div>

  <button @click="resetCart()">清空</button>
  <button @click="checkout()">結帳</button>
  <div>
    <h2>訂單</h2>

    <template v-for="shopping in shoppingOrder">
      <Shopping :value="shopping"></Shopping>
    </template>

  </div>
</template>
