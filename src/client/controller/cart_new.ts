// import { type Ref, ref, watch } from "vue";
import { onMounted, type Ref, ref } from "vue";
import {
  email,
  password,
  session,
  userId,
  userInfo,
  username,
} from "../model/global_state";

export const cartItems: Ref<{ item_id: number; quantity: number }[]> = ref([]);
export const orderId: Ref<number> = ref(0);
export type requestInfo = {
  itemId: number;
  quantity: number;
};
// 抓使用者的購物車/cart/get
export const fetchCartData = async () => {
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
      console.log("getCart successful:", data.content);
      if (data.type === "cart") {
        cartItems.value = data.content;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

// 清空購物車/cart/clean
export const resetCart = async () => {
  try {
    console.log(userId.value);
    console.log(session.value);

    const response = await fetch(`${window.location.origin}/api/cart/clean`, {
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
      console.log("Cart reset successful");
      fetchCartData();
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};

// /cart/set 設定某項商品在購物車裡總數
export const changeItem = async (
  itemId: number,
  quantity: number,
) => {
  try {
    const response = await fetch(`${window.location.origin}/api/cart/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId.value,
        session: session.value,
        item_id: itemId,
        quantity: quantity,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Cart modified successfully:", data.content);
      if (data.type === "cart") {
        cartItems.value = data.content;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else if (response.status === 405) {
      console.error("Failed to modify cart:", await response.text());
    } else {
      console.error("Failed to modify cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error during modifying cart:", error);
  }
};

// /cart/del 移除某項商品
export const delItem = async (itemId: number) => {
  try {
    const response = await fetch(`${window.location.origin}/api/cart/del`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId.value,
        session: session.value,
        item_id: itemId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Cart item removed successfully:", data.content);
      if (data.type === "cart") {
        cartItems.value = data.content;
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else if (response.status === 405) {
      console.error("Failed to remove cart item:", await response.text());
    } else {
      console.error("Failed to remove cart item:", response.statusText);
    }
  } catch (error) {
    console.error("Error during removing cart item:", error);
  }
};

// /cart/checkout 結帳
export const checkout = async () => {
  try {
    const response = await fetch(
      `${window.location.origin}/api/cart/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId.value,
          session: session.value,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      if (data.type === "checkout") {
        console.log("Checkout successful. Order ID:", data.content.order_id);
        orderId.value = data.content.order_id;
        resetCart(); // 結帳完要清空購物車
      } else {
        console.error("Unexpected response type:", data.type);
      }
    } else if (response.status === 400) {
      console.error("Checkout failed:", await response.text());
    } else {
      console.error("Failed to checkout:", response.statusText);
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
};

onMounted(() => {
  fetchCartData();
});
