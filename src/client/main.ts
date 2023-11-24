import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import AppVue from "./App.vue";
import HomeVue from "./view/Home.vue";
import AboutVue from "./view/About.vue";
import NotFoundVue from "./view/404.vue";
import ItemVue from "./view/Item.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeVue },
    { path: "/about", component: AboutVue },
    { path: "/item/:id", component: ItemVue },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundVue },
  ],
});

const app = createApp(AppVue);

app.use(router);

app.mount("#app");
