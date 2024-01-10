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
      <div class="welcome-message">Hello: {{ GlobalState.username }}</div>
      <button @click="handleLogout()" class="logout-button">Logout</button>
    </div>
  </template>
  <div class="cart-container">
    <h2>Your Cart</h2>

    <table class="cart-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in renderCart" :key="item.item_id">
          <td>{{ index + 1 }}</td>
          <!-- {{ item.item_id }} - {{ item.quantity }} -->
          <td>{{ item.item_id }}</td>
          <td>{{ item.display_name }}</td>
          <td>${{ item.price }}</td>
          <td>
            <button @click="changeItem(item.item_id, item.quantity + 1)">+</button>
            {{ item.quantity }}
            <button @click="changeItem(item.item_id, item.quantity - 1)">-</button>
          </td>
          <td>
            <button @click="delItem(item.item_id)">移除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="total-cost-container">
    <span>總額: </span>
    <span>{{ renderTotalCost }}</span>
  </div>

  <button @click="resetCart()">清空</button>
  <button @click="checkout()">結帳</button>
  <div class="order-container">
    <h2>訂單</h2>

    <template v-for="shopping in shoppingOrder">
      <Shopping :value="shopping"></Shopping>
    </template>

  </div>
</template>

<style>
  .welcome-container {
    text-align: center;
    margin-bottom: 20px;
  }

  .welcome-message {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .logout-button {
    background-color: #f00;
    color: #fff;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
  }

  .cart-container {
    width: 60%;

    margin-bottom: 20px;
  }

  .cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }

  .cart-table th, .cart-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .action-button {
    background-color: #007bff;
    color: #fff;
    padding: 6px 10px;
    margin-right: 5px;
    border: none;
    cursor: pointer;
  }

  .total-cost-container {
    margin-top: 10px;
    font-weight: bold;
  }

  .cart-buttons {
    margin-top: 15px;
  }

  .reset-button, .checkout-button {
    background-color: #28a745;
    color: #fff;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }

  .order-container {
    width: 60%;
  }

  .order-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
</style>