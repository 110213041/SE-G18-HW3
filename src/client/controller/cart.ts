import { reactive, Ref, ref } from "vue";

type cartItem = {
  itemId: number;
  quantity: number;
};

let localCart = localStorage.getItem("cart_state");
if (localCart === null) {
  localStorage.setItem("cart_state", JSON.stringify([]));
  localCart = JSON.stringify([]);
}

const cart: cartItem[] = JSON.parse(localCart);

export const cartState = reactive({
  cart: cart,
  updateCartItem(id: number, quantity: number) {
    if (quantity < 1) quantity = 1;

    const targetIndex = this.cart.findIndex((v: cartItem) => v.itemId === id);
    if (targetIndex > -1) {
      this.cart[targetIndex].quantity = quantity;
    } else {
      this.cart.push({
        itemId: id,
        quantity: quantity,
      });
    }
    this.cart.sort((a: cartItem, b: cartItem) => a.itemId - b.itemId);
    localStorage.setItem("cart_state", JSON.stringify(this.cart));
  },
  removeCartItem(id: number) {
    this.cart = this.cart.filter((v: cartItem) => v.itemId !== id);
    this.cart.sort((a: cartItem, b: cartItem) => a.itemId - b.itemId);
    localStorage.setItem("cart_state", JSON.stringify(this.cart));
  },
});

export const isShow = ref(false);
export const isLoading = ref(false);

export type item = {
  id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  state: number;
};
export const fetchResult: Ref<item[]> = ref([]);
export const joinResult = ref([]);

export async function toggleShow() {
  isShow.value = isShow.value ? false : true;
  if (isShow.value) {
    await getData();
    await updateJoinArray();
    updateTotalCost();
  }
}

async function getData() {
  isLoading.value = true;
  const pendingFetch = [...cartState.cart].map((v) => {
    const currentUrl = new URL(location.origin);
    currentUrl.pathname = "/api/item";
    currentUrl.searchParams.set("q", String(v.itemId));
    return currentUrl;
  });

  const resp: { status: "success"; result: item }[] = await Promise.all(
    pendingFetch.map(async (url) => {
      const resp = await fetch(url);
      return resp.json();
    }),
  );

  fetchResult.value = resp.map((v) => v.result);
  isLoading.value = false;
}

export const totalCost = ref(0);

export async function updateCartItemWrapper(id: number, quantity: number) {
  cartState.updateCartItem(id, quantity);
  await getData();
  await updateJoinArray();
  updateTotalCost();
}

export async function removeCartItemWrapper(id: number) {
  cartState.removeCartItem(id);
  await getData();
  await updateJoinArray();
  updateTotalCost();
}

export async function updateJoinArray() {
  await getData();
  joinResult.value = [cartState.cart, fetchResult.value];
}

export function updateTotalCost() {
  totalCost.value = 0;
  for (let i = 0; i < cartState.cart.length; i++) {
    //@ts-ignore
    totalCost.value += joinResult.value[0][i].quantity *
      joinResult.value[1][i].price;
  }
}
