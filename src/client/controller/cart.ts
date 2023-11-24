import { reactive } from "vue";

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
