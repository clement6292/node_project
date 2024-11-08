import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue'; // Assurez-vous que le chemin est correct
import Login from './components/Login.vue';
import Register from './components/Register.vue';

const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } }, // Route protégée
    { path: '/login', component: Login },
    { path: '/register', component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est authentifié

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login'); // Redirige vers la page de connexion s'il n'est pas authentifié
    } else {
        next(); // Autoriser la navigation
    }
});

export default router; // Assurez-vous d'exporter le routeur
