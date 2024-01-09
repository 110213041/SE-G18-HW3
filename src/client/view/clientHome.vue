<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { userId, session } from "../model/global_state";

const cartItems = ref([]);

const fetchCartData = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/cart/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
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
        cart: cartItems.value, // 将购物车内容作为参数传递
      }),
    });

    if (response.ok) {
      console.log('Cart submitted successfully');
      // 提交成功后清空购物车
      resetCart();
    } else {
      console.error('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};

// 在组件挂载后获取购物车数据
onMounted(() => {
  fetchCartData();
});

return {
  cartItems,
  resetCart,
  submitCart, // 将新添加的函数暴露给模板
};

</script>

<template>
  <div>
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cartItems" :key="item.item_id">
        Item ID: {{ item.item_id }} - Quantity: {{ item.quantity }}
      </li>
    </ul>
    <button @click="resetCart">Reset Cart</button>
    <!-- 新添加的提交购物车按钮 -->
    <button @click="submitCart">Submit Cart</button>
  </div>
</template>
