import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import Register from '../pages/UserRegister.vue';
import Login from '../pages/UserLogin.vue';
import SentimentAnalysis from '../pages/SentimentAnalysis.vue';
import NotFound from '../pages/NotFound.vue';
import Logout from '../pages/UserLogout.vue';
import Summary from '../pages/SummaryText.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/login/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout/',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/register/',
    name: 'Register',
    component: Register,
  },
  {
    path: '/sentiment-analysis/',
    name: 'SentimentAnalysis',
    component: SentimentAnalysis,
  },
  {
    path: '/summary/',
    name: 'Summary',
    component: Summary,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  // Other routes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
