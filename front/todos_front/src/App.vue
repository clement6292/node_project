<template>
   
 <nav class="bg-blue-500 text-white p-5 mb-5 ml-5 flex space-x-5 rounded-lg">
   
<router-link 
      to="/" 
      class="text-xl hover:bg-blue-600 px-4 py-2 rounded-md transition duration-200"
    >
      Home
    </router-link>
    <router-link 
      to="/email" 
      class="text-xl hover:bg-blue-600 px-4 py-2 rounded-md transition duration-200"
    >
      Form
    </router-link>
  </nav>
  <div class="relative flex flex-col items-center min-h-screen bg-custom-background bg-cover bg-center bg-fixed min-h-screen">
    <router-view /> 
    <button
      v-if="isLoggedIn"
      @click="ouvrirAlerteDeconnexion"
      class="absolute top-4 right-4 px-4 py-2 font-bold text-white bg-lime-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Se déconnecter
    </button>
    

    <!-- Alerte de confirmation de déconnexion -->
    <div v-if="showLogoutConfirmAlert" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Déconnexion</h3>
        <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <div class="flex justify-end">
          <button
            @click="confirmerDeconnexion"
            class="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
          >
            Confirmer
          </button>
          <button
            @click="annulerDeconnexion"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  

    <!-- Alerte de déconnexion réussie -->
    <div v-if="showLogoutSuccessAlert" class="fixed bottom-4 right-4 bg-lime-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center space-x-2">
      <span>Déconnexion réussie !</span>
      <button @click="fermerAlertSuccess" class="text-white hover:text-gray-200 focus:outline-none">X</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem("token"));
const showLogoutConfirmAlert = ref(false);
const showLogoutSuccessAlert = ref(false);

const ouvrirAlerteDeconnexion = () => {
  showLogoutConfirmAlert.value = true;
};

const confirmerDeconnexion = () => {
  logout();
  showLogoutConfirmAlert.value = false;
  showLogoutSuccessAlert.value = true;
};

const annulerDeconnexion = () => {
  showLogoutConfirmAlert.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  router.push('/login');
};

const fermerAlertSuccess = () => {
  showLogoutSuccessAlert.value = false;
};
</script>

<style>
/* Ajoutez votre style ici si nécessaire */
</style>
