import { type Ref, ref } from "vue";

export type cartItem = {
  itemId: number;
  quantity: number;
};
// export type info = {
//   name: string;
//   email: string;
//   password: string;
//   user_info: number;
//   session: string;
//   life_time: number;
//   owner_id: number;
//   state: number;
// };
export const cart: Ref<cartItem[]> = ref([]);
// export const userInfo = ref(0);
export const username = ref("");
export const password = ref("");
export const email = ref("");
export const userId = ref(0);
export const session = ref("");
export const userInfo: Ref<
  {
    email: string;
    user_name: string;
    role: {
      seller: boolean;
      shipper: boolean;
    };
  } | undefined
> = ref();
// export const password = ref('');
// 將這個函數放在某個適當的文件中，例如 homeRouter.js

//找不同角色的家
import { useRouter } from 'vue-router';
export type role = {
  seller: boolean;
  shipper: boolean;
};
export function findHome(role:role) {
  if ( role.seller) {
    return '/sellerHome';
  } else if (role.shipper) {
    return '/shipperHome';
  } else {
    return '/clientHome';
  }
}
