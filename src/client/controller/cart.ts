import { type Ref, ref, watch } from "vue";
import { cart, type cartItem } from "../model/global_state";

type item = {
  id: number;
  display_name: string;
  price: number;
  description: string;
  owner_id: number;
  state: number;
};

type itemInfo = Pick<cartItem, "quantity"> & Omit<item, "state">;

export const isShow = ref(false);
export const cartDetailItem: Ref<itemInfo[]> = ref([]);
export const totalCost = ref(0);

export function toggleShow() {
  isShow.value = isShow.value ? false : true;
}

export function updateCartItem(id: number, quantity: number) {
  if (quantity < 1) quantity = 1;

  const targetId = cart.value.findIndex((v) => v.itemId === id);

  if (targetId > -1) {
    cart.value[targetId].quantity = quantity;
  } else {
    cart.value.push({
      itemId: id,
      quantity: quantity,
    });
  }

  cart.value.sort((a, b) => a.itemId - b.itemId);

  updateCartDetailInfo();
}

export function removeCartItem(id: number) {
  cart.value = cart.value.filter((v) => v.itemId !== id);
  cart.value.sort((a, b) => a.itemId - b.itemId);

  updateCartDetailInfo();
}

async function updateCartDetailInfo() {
  const links = [...cart.value].map((v) => {
    const url = new URL(location.origin);
    url.pathname = "/api/item";
    url.searchParams.set("q", String(v.itemId));
    return url;
  });

  type successResponse = {
    status: "success";
    result: item;
  };

  type failResponse = {
    status: "fail";
    message: string;
  };

  type dbResponse = successResponse | failResponse;

  const resp: dbResponse[] = await Promise.all(links.map(async (url) => {
    const resp = await fetch(url);
    return resp.json();
  }));

  const failResp = resp.filter((v) => v.status === "fail");

  if (failResp.length > 0) {
    console.error("cart request api fail!");
    console.error(failResp);
    return;
  }

  const successResp = resp.filter((v) =>
    v.status === "success"
  ) as successResponse[];
  const successResult = successResp.map((v) => v.result).sort((a, b) =>
    a.id - b.id
  );

  cartDetailItem.value = [];

  cart.value.sort((a, b) => a.itemId - b.itemId).forEach((v, i) => {
    cartDetailItem.value.push(
      {
        id: v.itemId,
        display_name: successResult[i].display_name,
        description: successResult[i].description,
        price: successResult[i].price,
        owner_id: successResult[i].owner_id,
        quantity: v.quantity,
      },
    );
  });

  totalCost.value = cartDetailItem.value.reduce(
    (prev, v) => prev + v.price * v.quantity,
    0,
  );
}

export function initCart() {
  let localCart = localStorage.getItem("cart_state");

  if (localCart === null) {
    localStorage.setItem("cart_state", JSON.stringify([]));
    localCart = JSON.stringify([]);
  }

  cart.value = JSON.parse(localCart);
}

watch(cart, () => {
  console.log("cart");
  console.log(cart.value);
});

watch(cartDetailItem, () => {
  console.log("cartDetailItem");
  console.log(cartDetailItem.value);
});
