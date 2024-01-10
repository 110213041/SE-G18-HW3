import { nextTick, type Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { router } from "../controller/router";
// const router = useRouter();
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

export type role = {
  seller: boolean;
  shipper: boolean;
};
export function findHome(role: role) {
  if (role.seller) {
    return "/sellerHome";
  } else if (role.shipper) {
    return "/shipperHome";
  } else {
    return "/clientHome";
  }
}

// 登出
const logout = async () => {
  username.value = "";
  password.value = "";
  email.value = "";
  userId.value = 0;
  session.value = "";
  userInfo.value = undefined;
};
export const handleLogout = async () => {
  await logout();

  // 在成功登出後輸出 "Goodbye"
  console.log("Goodbye");
  await nextTick();

  // 檢查 router 是否已定義，然後進行導航
  if (router) {
    router.push("/login");
  } else {
    console.error("router is undefined");
  }
};

const savedSession = sessionStorage.getItem("save_state");
if (savedSession !== null) {
  const result = JSON.parse(savedSession);

  userId.value = result.userId;
  session.value = result.session;
  userInfo.value = result.userInfo;
  username.value = userInfo.value!.user_name;
}
