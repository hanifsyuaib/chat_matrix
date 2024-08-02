import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import Register from '../pages/UserRegister.vue';
import Login from '../pages/UserLogin.vue';
import SentimentAnalysis from '../pages/SentimentAnalysis.vue';
import NotFound from '../pages/NotFound.vue';
import Logout from '../pages/UserLogout.vue';
import SummarizeText from '../pages/SummarizeText.vue';
import Dashboard from '../pages/UserDashboard.vue';
import PlateRecognition from '../pages/PlateRecognition.vue';
import ChangePassword from '../pages/UserChangePassword.vue';

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
    path: '/dashboard/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/sentiment-analysis/',
    name: 'SentimentAnalysis',
    component: SentimentAnalysis,
  },
  {
    path: '/summarize-text/',
    name: 'SummarizeText',
    component: SummarizeText,
  },
  {
    path: '/plate-recognition/',
    name: 'PlateRecognition',
    component: PlateRecognition,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/change-password/',
    name: 'ChangePassword',
    component: ChangePassword,
  },
  // Other routes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
