import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import AboutPage from "../pages/AboutPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
