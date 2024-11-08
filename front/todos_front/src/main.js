// src/main.js
import { createApp } from 'vue';
import App from './App.vue'; 
import router from './router'; // Importez le routeur
import './assets/main.css';

import axios from 'axios'; 

// Configuration d'Axios
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const isTokenExpired = Date.now() > tokenExpiration;

    if (isTokenExpired) {
      await refreshToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function refreshToken() {
  // Implémentez ici la logique pour obtenir un nouveau token
}

// Créez l'application et utilisez le routeur
createApp(App).use(router).mount('#app'); 
