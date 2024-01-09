<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { handleLogout} from "../model/global_state";

const cartItems = ref([]);

const fetchCartData = async () => {
  // console.log(`${userId.value}, ${session.value}`)
  try {
    const response = await fetch(`${window.location.origin}/api/cart/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId.value,
        session: session.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('getCart successful:', data.content);
      if (data.type === 'cart') {
        cartItems.value = data.content;
      } else {
        console.error('Unexpected response type:', data.type);
      }
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};

const resetCart = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/cart/clean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId.value,
        session: session.value,
      }),
    });

    if (response.ok) {
      console.log('Cart reset successful');
      fetchCartData();
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};

// 新增函数，用于提交购物车内容
const submitCart = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/cart/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId.value,
        session: session.value,
        cart: cartItems.value,
      }),
    });

    if (response.ok) {
      console.log('Cart submitted successfully');
    
      resetCart();
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};

onMounted(() => {
  fetchCartData();
});


</script>

<template>
  <template v-if="userId !== undefined">
    <div class="welcome-container">
      <div>Hello: {{ username }}</div>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </template>
  <div>
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cartItems" :key="item.itemId">
        Item ID: {{ item.item_id }} - Quantity: {{ item.quantity }}
      </li>
    </ul>
    <button @click="resetCart">Reset Cart</button>
    <button @click="submitCart">Submit Cart</button>
  </div>
</template>
