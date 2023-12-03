import { type Ref, ref } from "vue";

export type cartItem = {
  itemId: number;
  quantity: number;
};

export const cart: Ref<cartItem[]> = ref([]);
