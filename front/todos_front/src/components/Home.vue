<template>

  <div>
    <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">Activités de la semaine</h1>
    
    <!-- <TaskForm :jourSelectionne="jourSelectionne" @tacheAjoutee="handleTacheAjoutee" /> -->
    <Task :taches="taches" @choisirJour="choisirJour" @tacheSupprimee="supprimerTache" />
    <Email/>
  </div>
</template>

<script setup>
import Task from './Task.vue';
import TaskForm from './TaskForm.vue';
import { ref } from 'vue';
import axios from 'axios';
import Email from '../components/EmailVue.vue';

const taches = ref({
  Lundi: [],
  Mardi: [],
  Mercredi: [],
  Jeudi: [],
  Vendredi: [],
  Samedi: [],
  Dimanche: [],
});

const jourSelectionne = ref('');

const handleTacheAjoutee = (tache) => {
  if (taches.value[tache.jour]) {
    taches.value[tache.jour].push(tache);
  }
};

const choisirJour = (jour) => {
  jourSelectionne.value = jour;
};

const supprimerTache = async (id) => {
  try {
    await axios.patch(`http://localhost:5000/api/tasks/${id}`,{isDelected: true });
    // Une fois supprimée, mettez à jour le tableau de tâches
    for (const jour in taches.value) {
      taches.value[jour] = taches.value[jour].filter(tache => tache._id !== id);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
  }
};
</script>

<style>
/* Ajoutez votre style ici */
</style>
