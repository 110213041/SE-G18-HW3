import { createRouter, createWebHistory } from "vue-router";

import HomeVue from "./view/Home.vue";
import AboutVue from "./view/About.vue";
import NotFoundVue from "./view/404.vue";
import ItemVue from "./view/Item.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeVue },
    { path: "/about", component: AboutVue },
    { path: "/item/:id", component: ItemVue },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundVue },
  ],
});
