<script lang="ts">
import { ref} from 'vue';
import { useRouter } from 'vue-router';
import { handleLogout} from "../model/global_state";
import { username, password, email, userId, session, userInfo} from "../model/global_state";
import { 
  createItem,
  getAllItems,
  getItemInfo,
  modifyItemStatus, 
} from '../controller/items';

const router = useRouter();

export default {
  data() {
    return {
      item_name: ref(''),
      item_price: ref(0),
      item_description: ref(''),
    };
  },
}

export const  item_name= ref('');
export const  item_price= ref(0);
export const  item_description= ref('');

const goEditItem = () => {
  router.push('/register');
};
const goGetOrder = () => {
  router.push('/register');
};
</script>

<template>
  <template v-if="userId !== undefined">
    <div class="welcome-container">
      <div>Hello: {{ username }}</div>
      <button @click="handleLogout()" class="logout-button">Logout</button>
    </div>
  </template>

  <div>
    <router-link to="/" class="home-link">商品管理</router-link>
  <br>
    <router-link to="/register" class="register-link">訂單管理</router-link>
  </div>

  <!-- <div>
    <h2>新增商品</h2>
    <form>
      <div>
        <label for="itemName">Item Name:</label>
        <input v-model="item_name" type="text" id="itemName" class="form-input" />
      </div>
      <div>
        <label for="itemPrice">Item Price:</label>
        <input v-model.number="item_price" type="number" id="itemPrice" class="form-input" />
      </div>
      <div>
        <label for="itemDescription">Item Description:</label>
        <textarea  v-model="item_description" id="itemDescription" class="form-input"></textarea>
      </div>
      <button @click="createItem(item_name, item_price, item_description)">Submit</button>
      
    </form>
  </div> -->

</template>
