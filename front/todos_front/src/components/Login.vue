<template>
  <div class="flex flex-col items-center justify-center min-h-screen ">
    <div class="w-full max-w-md p-8 space-y-6 bg-sky-100 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-800">Connexion</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Nom d'utilisateur" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out" 
          />
        </div>
        <div>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Mot de passe" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out" 
          />
        </div>
        <button 
          type="submit" 
          class="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Se connecter
        </button>
      </form>
      <p class="text-center text-gray-600">
        Pas encore de compte ? 
        <button @click="showRegister" class="text-blue-600 hover:underline">Inscrivez-vous</button>
      </p>
    </div>

    <!-- Alerte de connexion réussie -->
    <div v-if="showLoginSuccessAlert" class="fixed bottom-4 right-4 bg-lime-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center space-x-2">
      <span>Connexion réussie !</span>
      <button @click="fermerAlertSuccess" class="text-white hover:text-gray-200 focus:outline-none">X</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits();
const router = useRouter();
const username = ref('');
const password = ref('');
const showLoginSuccessAlert = ref(false);

const login = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: username.value,
      password: password.value,
    });

    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    if (accessToken) {
      localStorage.setItem('token', accessToken);
      showLoginSuccessAlert.value = true;
      emit('loggedIn');
      setTimeout(() => router.push('/'), 2000); // Redirige après 2 secondes
    } else {
      alert('Erreur : token d\'accès non reçu.');
    }
  } catch (error) {
    if (error.response) {
      console.error('Erreur de connexion:', error.response.data.message);
      alert(`Erreur : ${error.response.data.message}`);
    } else {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion.');
    }
  }
};

const showRegister = () => {
  router.push('/register'); // Redirige vers la page d'inscription
};

const fermerAlertSuccess = () => {
  showLoginSuccessAlert.value = false;
};
</script>

<style scoped>
/* Les styles sont gérés par Tailwind CSS */
</style>
