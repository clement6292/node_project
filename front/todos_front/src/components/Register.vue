<template>
  <div class="flex flex-col items-center justify-center min-h-screen ">
    <div class="w-full max-w-md p-8 space-y-6 bg-sky-100 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-800">Inscription</h1>
      <form @submit.prevent="register" class="space-y-4">
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
          S'inscrire
        </button>
      </form>
      <p class="text-center text-gray-600">
        Déjà un compte ? 
        <button @click="redirectToLogin" class="text-blue-600 hover:underline">Connectez-vous</button>
      </p>
    </div>

    <!-- Alerte de succès d'inscription -->
    <div v-if="showRegisterSuccessAlert" class="fixed bottom-4 right-4 bg-lime-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center space-x-2">
      <span>Inscription réussie !</span>
      <button @click="closeAlertSuccess" class="text-white hover:text-gray-200 focus:outline-none">X</button>
    </div>

    <!-- Alerte d'erreur d'inscription -->
    <div v-if="showRegisterErrorAlert" class="fixed bottom-4 right-4 bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center space-x-2">
      <span>Erreur lors de l'inscription.</span>
      <button @click="closeAlertError" class="text-white hover:text-gray-200 focus:outline-none">X</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const showRegisterSuccessAlert = ref(false);
const showRegisterErrorAlert = ref(false);

const register = async () => {
  try {
    await axios.post('http://localhost:5000/api/auth/register', {
      username: username.value,
      password: password.value,
    });
    showRegisterSuccessAlert.value = true;
    setTimeout(() => {
      router.push('/login'); // Redirige vers la page de connexion après 2 secondes
    }, 2000);
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    showRegisterErrorAlert.value = true;
  }
};

const redirectToLogin = () => {
  router.push('/login'); // Redirige directement vers la page de connexion
};

const closeAlertSuccess = () => {
  showRegisterSuccessAlert.value = false;
};

const closeAlertError = () => {
  showRegisterErrorAlert.value = false;
};
</script>

<style scoped>
/* Les styles sont gérés par Tailwind CSS */
</style>
