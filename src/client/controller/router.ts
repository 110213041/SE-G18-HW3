import { createRouter, createWebHistory } from "vue-router";

import HomeVue from "../view/Home.vue";
import AboutVue from "../view/About.vue";
import NotFoundVue from "../view/404.vue";
import ItemVue from "../view/Item.vue";
import SellerVue from "../view/Seller.vue";
import loginVue from "../view/login.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeVue },
    { path: "/about", component: AboutVue },
    { path: "/item/:id", component: ItemVue },
    { path: "/seller", component: SellerVue },
    { path: "/login", component: loginVue },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundVue },
  ],
});
