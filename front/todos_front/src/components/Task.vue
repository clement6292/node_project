<template>
  <div class="min-h-screen flex items-center justify-center">
    <div>
      <!-- Alerte de confirmation de suppression -->
      <div v-if="showDeleteAlert" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Supprimer la tâche</h3>
          <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
          <div class="flex justify-end">
            <button
              @click="confirmerSuppression"
              class="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
            >
              Confirmer
            </button>
            <button
              @click="annulerSuppression"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Alerte de modification de tâche -->
      <div v-if="showEditAlert" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Modifier la tâche</h3>
          <p class="text-gray-600 mb-4">Entrez la nouvelle description :</p>
          <input
            v-model="nouvelleDescription"
            type="text"
            class="border border-gray-300 w-full rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex justify-end">
            <button
              @click="confirmerModification"
              class="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            >
              Modifier
            </button>
            <button
              @click="annulerModification"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Formulaire de recherche -->
      <div class="text-center mb-10">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une tâche..."
          class="bg-sky-100 text-2xl px-4 py-2 border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      <!-- Formulaire d'ajout de tâche -->
      <div class="mb-12">
        <div v-if="jourSelectionne" class="text-center text-3xl mb-4 text-gray-700">
          Jour sélectionné : <strong>{{ jourSelectionne }}</strong>
        </div>
        <TaskForm :jourSelectionne="jourSelectionne" @tacheAjoutee="ajouterTacheAuJour" />
      </div>
      
      <!-- Tableau des jours de la semaine -->
      <table class="min-w-full bg-white border border-gray-300 rounded-lg mt-4">
        <thead>
          <tr class="bg-sky-200 text-gray-700">
            <th
              v-for="jour in joursSemaine"
              :key="jour"
              class="py-4 px-6 text-left border-b border-gray-300 text-2xl"
            >
              {{ jour }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="jour in joursSemaine"
              :key="jour"
              class="py-3 px-6 border-x border-gray-300"
              @click="choisirJour(jour)"
            >
              <div
                v-for="tache in filterTaches(tachesParJour[jour] || [])"
                :key="tache._id"
                class="bg-rose-50 border border-gray-300 rounded-lg shadow-md p-4 mb-2 overflow-hidden"
              >
                <span class="text-gray-800 block truncate font-medium text-xl">{{ tache.description }}</span>
                <div class="flex justify-between mt-2">
                  <button
                    @click.stop="ouvrirAlerteSuppression(tache)"
                    class="bg-red-500 text-black py-1 px-2 rounded"
                  >
                    Supprimer
                  </button>
                  <button
                    @click.stop="ouvrirAlerteModification(tache)"
                    class="bg-blue-500 text-black-500 py-1 px-2 rounded ml-2"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Section de la corbeille -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-center mb-4">Corbeille</h2>
        <div v-for="tache in tachesSupprimees" :key="tache._id" class="bg-gray-200 border border-gray-300 rounded-lg shadow-md p-4 mb-2">
          <span class="text-gray-800 block">{{ tache.description }}</span>
          <div class="flex justify-between mt-2">
            <button @click="restaurerTache(tache._id)" class="border border-green-600 bg-green-400 text-white py-1 px-2 rounded">
              Restaurer
            </button>
            <button @click="supprimerDefinitivementTache(tache._id)" class="border border-red-600 bg-red-400 text-black py-1 px-2 rounded">
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import TaskForm from "./TaskForm.vue";

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const tachesParJour = reactive({});
const tachesSupprimees = reactive([]); // Stockage des tâches supprimées
const jourSelectionne = ref("");
const searchQuery = ref('');

// Variables pour les alertes de confirmation
const showDeleteAlert = ref(false);
const showEditAlert = ref(false);
let tacheASupprimer = null;
let tacheAModifier = null;
const nouvelleDescription = ref("");

// Fonction pour choisir un jour
const choisirJour = (jour) => {
  jourSelectionne.value = jour;
};

// Fonction pour ajouter une tâche au jour sélectionné
const ajouterTacheAuJour = (tache) => {
  const jour = tache.jour;
  if (!tachesParJour[jour]) {
    tachesParJour[jour] = [];
  }
  tachesParJour[jour].push(tache);
};

// Ouvre l'alerte de modification pour la tâche sélectionnée
const ouvrirAlerteModification = (tache) => {
  tacheAModifier = tache;
  nouvelleDescription.value = tache.description;
  showEditAlert.value = true;
};

// Confirme la modification de la tâche
const confirmerModification = async () => {
  if (nouvelleDescription.value.trim() !== "") {
    tacheAModifier.description = nouvelleDescription.value;
    try {
      await axios.patch(`/api/taches/${tacheAModifier._id}`, tacheAModifier); // Mise à jour côté serveur
      showEditAlert.value = false;
      nouvelleDescription.value = ""; // Réinitialiser le champ de description après la modification
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche", error);
     
    }
  }
};

// Annule la modification
const annulerModification = () => {
  showEditAlert.value = false;
};

// Ouvre l'alerte de suppression pour la tâche sélectionnée
const ouvrirAlerteSuppression = (tache) => {
  tacheASupprimer = tache;
  showDeleteAlert.value = true;
};

// Confirme la suppression de la tâche
const confirmerSuppression = async () => {
  if (tacheASupprimer) {
    console.log("ID de la tâche à supprimer:", tacheASupprimer._id); // Ajoute ce log pour vérifier l'ID
    tacheASupprimer.isDeleted = true; // Marque la tâche comme supprimée
    try {
      const response = await axios.patch(`/api/taches/${tacheASupprimer._id}`, tacheASupprimer); // Mise à jour côté serveur
      console.log("Réponse serveur:", response); 
      
      // Si la réponse est correcte, mets à jour la liste des tâches
      tachesParJour[tacheASupprimer.jour] = tachesParJour[tacheASupprimer.jour].filter((t) => t._id !== tacheASupprimer._id);
      tachesSupprimees.push(tacheASupprimer); // Ajoute la tâche à la corbeille
      
      // Ferme l'alerte de confirmation
      showDeleteAlert.value = false;
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  }
};


// Annule la suppression
const annulerSuppression = () => {
  showDeleteAlert.value = false;
};

// Restaurer une tâche supprimée
const restaurerTache = async (id) => {
  const tacheARestaurer = tachesSupprimees.find((tache) => tache._id === id);
  if (tacheARestaurer) {
    tacheARestaurer.isDeleted = false;
    try {
      await axios.patch(`/api/taches/${id}`, tacheARestaurer); // Réactive la tâche
      tachesParJour[tacheARestaurer.jour].push(tacheARestaurer);
      tachesSupprimees.splice(tachesSupprimees.indexOf(tacheARestaurer), 1);
    } catch (error) {
      console.error("Erreur lors de la restauration de la tâche", error);
      alert('Une erreur est survenue lors de la restauration de la tâche.');
    }
  }
};

// Supprimer définitivement une tâche
const supprimerDefinitivementTache = async (id) => {
  const tacheASupprimer = tachesSupprimees.find((tache) => tache._id === id);
  if (tacheASupprimer) {
    try {
      await axios.delete(`/api/taches/${id}`);  // Suppression définitive
      tachesSupprimees.splice(tachesSupprimees.indexOf(tacheASupprimer), 1);
    } catch (error) {
      console.error("Erreur lors de la suppression définitive de la tâche", error);
      alert('Une erreur est survenue lors de la suppression définitive de la tâche.');
    }
  }
};

// Filtrer les tâches en fonction de la recherche
const filterTaches = (taches) => {
  return taches.filter(tache => tache.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
};
</script>



