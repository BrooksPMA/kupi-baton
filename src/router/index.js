import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Distribute from '../components/Distribute.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'distribute',
      component: Distribute,
    },
    {
      path: '/:slug',
      name: 'home',
      component: Home,
    },
  ],
});

export default router;
