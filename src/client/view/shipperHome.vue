<script lang="ts" setup>
import { ref } from "vue";
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { handleLogout} from "../model/global_state";
import { 
  // getShippingOrder,
  // getAllShoppingOrder,
  // getShoppingOrder,
  getAllShippingOrder,
} from "../controller/order";

// export const State = ref(0);


</script>

<template>
<h3>this is shipper's home</h3>
<template v-if="userId !== undefined">
  <div class="welcome-container">
    <div>Hello: {{ username}}</div>
    <button @click="handleLogout" class="logout-button">Logout</button>
  </div>
  <!-- <div class="form-group">
    <label for="State">state:</label>
    <input v-model="State" type="text" id="state" class="form-input" />
  </div> -->
</template>
<button @click="getAllShippingOrder()" class="det-all-oder">取得所有商品運輸記錄</button>
</template>

<style>

</style>