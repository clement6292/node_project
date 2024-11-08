// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; // Chemin vers le composant Home
import Login from '../components/Login.vue'; // Chemin vers le composant Login
import Register from '../components/Register.vue'; // Chemin vers le composant Register
import Email  from "../components/EmailVue.vue";


const routes = [
    { path: '/', component: Home, meta: { requiresAuth: true } }, // Route protégée
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {path:'/email',component:Email}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Middleware pour vérifier l'authentification
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est authentifié

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    } else {
        next(); // Autoriser la navigation
    }
});

export default router; // Assurez-vous d'exporter le routeur
