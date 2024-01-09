
<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const orders = ref([]);
    
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          orders.value = data;
        } else {
          console.error('獲取訂單失敗:', response.status);
        }
      } catch (error) {
        console.error('獲取訂單時發生錯誤:', error);
      }
    };
    
    const confirmOrder = async (orderId) => {
      // 用API確認訂單
      // 將訂單狀態更新成'confirmed'
      // 用 fetchOrders 刷新列表
    };

    const shipOrder = async (orderId) => {
      // 用API標記訂單 'shipped'
      // 用 fetchOrders 刷新列表
    };
    
    onMounted(() => {
      fetchOrders();
    });
    
    return {
      orders,
      confirmOrder,
      shipOrder,
    };
  },
};
</script>
<template>
  <div>
    <h2>商家訂單</h2>
    <div v-if="orders.length === 0">
      <p>沒有定單。</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>客戶ID</th>
            <th>商品</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.customerName }}</td>
            <td>
              <ul>
                <li v-for="item in order.items" :key="item.itemId">
                  {{ item.name }} - 數量: {{ item.quantity }}
                </li>
              </ul>
            </td>
            <td>{{ order.status }}</td>
            <td>
              <button v-if="order.status === 'pending'" @click="confirmOrder(order.orderId)">
                確認訂單
              </button>
              <button v-if="order.status === 'confirmed'" @click="shipOrder(order.orderId)">
                出貨
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
