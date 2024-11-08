<template>
  <form @submit.prevent="ajouterTache" class="bg-sky-200 p-10 rounded-lg shadow-md max-w-md mx-auto">
    <div class="mb-4">
      <input 
        v-model="description" 
        placeholder="Nouvelle tâche" 
        required 
        class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <button 
      type="submit" 
      :disabled="!jourSelectionne" 
      class="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Ajouter
    </button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  jourSelectionne: {
    type: String,
    required: true,
  },
});

const emit = defineEmits();
const description = ref('');


const ajouterTache = async () => {
  // Vérifiez que le jour est sélectionné
  if (!props.jourSelectionne) {
    console.error('Veuillez sélectionner un jour.');
    return;
  }

  // Vérifiez que la description est renseignée
  if (!description.value) {
    console.error('Veuillez entrer une description pour la tâche.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Aucun jeton trouvé dans le localStorage. Veuillez vous reconnecter.");
      return;
    }

    console.log("Jeton récupéré :", token); // Vérification du jeton

    // Envoi de la requête POST au backend pour ajouter une tâche
    const response = await axios.post(
      'http://localhost:5000/api/tasks',
      {
        description: description.value,  // Assurez-vous que description est bien défini
        jour: props.jourSelectionne,     // Assurez-vous que jourSelectionne est bien défini
      },
        
         // Réinitialise la description après ajout
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then (console.log(props.jourSelectionne),);

    // Emet un événement pour notifier l'ajout de la tâche et réinitialise la description
    emit('tacheAjoutee', response.data);
    description.value = '';

  } catch (error) {
    // Gestion des erreurs HTTP
    if (error.response) {
      if (error.response.status === 403) {
        console.error("Erreur 403 : Accès refusé. Vérifiez le jeton ou l'authentification.");
      } else if (error.response.status === 400) {
        console.error("Erreur 400 : Données de tâche invalides.");
      } else {
        console.error("Erreur serveur lors de l'ajout de la tâche:", error.response.data.message || error.message);
      }
    } else {
      console.error("Erreur de réseau ou autre lors de l'ajout de la tâche:", error.message);
    }
  }
};





</script>

<style>
/* Ajoute ici tes styles personnalisés si nécessaire */
</style>
