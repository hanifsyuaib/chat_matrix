import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue'; // Example path to your components

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // Other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;