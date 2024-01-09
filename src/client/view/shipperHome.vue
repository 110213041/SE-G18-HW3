<script lang="ts" setup>
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { handleLogout} from "../model/global_state";
import { useRouter } from 'vue-router';

const router = useRouter();
const getAllShippingOrder = async () => {
  console.log(`${userId.value}, ${session.value}`)
  try {
  const response = await fetch(`${window.location.origin}/api/shipping/all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userId.value,
      session: session.value,
    }),
  });

  if (response.ok) {
    const data = await response.json();

    // 處理成功獲取的運輸單數據
    if (data.type === "shipment_all") {
      const shipmentList = data.content;
      console.log("Shipment List:", shipmentList);
    } else {
      console.error("Unexpected response type:", data.type);
    }
  } else {
    console.error("Failed to fetch shipment list:", response.statusText);
  }
} catch (error) {
  console.error("Error during fetch:", error);
}
};





</script>

<template>
<h3>this is shipper's home</h3>
<template v-if="userId !== undefined">
  <div class="welcome-container">
    <div>Hello: {{ username }}</div>
    <button @click="handleLogout" class="logout-button">Logout</button>
  </div>
</template>
<button @click="getAllShippingOrder" class="det-all-oder">取得所有訂單</button>
</template>

<style>

</style>