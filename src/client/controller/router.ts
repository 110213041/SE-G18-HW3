import { createRouter, createWebHistory } from "vue-router";

import HomeVue from "../view/Home.vue";
import AboutVue from "../view/About.vue";
import NotFoundVue from "../view/404.vue";
import ItemVue from "../view/Item.vue";
import SellerVue from "../view/Seller.vue";
import loginVue from "../view/login.vue";
import registerVue from "../view/register.vue";
import sellerHomeVue from "../view/sellerHome.vue";
import clientHomeVue from "../view/clientHome.vue";
import shipperHomeVue from "../view/shipperHome.vue";
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeVue },
    { path: "/about", component: AboutVue },
    { path: "/item/:id", component: ItemVue },
    { path: "/seller", component: SellerVue },
    { path: "/login", component: loginVue },
    { path: "/register", component: registerVue },
    { path: "/sellerHome", component: sellerHomeVue },
    { path: "/clientHome", component: clientHomeVue },
    { path: "/shipperHome", component: shipperHomeVue },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundVue },
  ],
});
