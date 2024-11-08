<template>
  <div>
    <h1 class="text-center mb-10 text-2xl font-bold color-blue-200">Formulaire d'envoie d'Email</h1>
    
    <div class="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <form @submit.prevent="sendEmail" class="space-y-6">
          <!-- Name Input -->
          <div>
              <label for="name" class="block text-lg font-medium text-gray-700">Name</label>
              <input 
                  type="text" 
                  v-model="form.name"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
              >
          </div>

          <!-- Email Input -->
          <div>
              <label for="email" class="block text-lg font-medium text-gray-700">Email</label>
              <input 
                  type="email" 
                  v-model="form.email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
              >
          </div>

          <!-- Message Textarea -->
          <div>
              <label for="message" class="block text-lg font-medium text-gray-700">Message</label>
              <textarea 
                  name="message"
                  v-model="form.message"
                  id="message"
                  cols="30" 
                  rows="5"
                  placeholder="Your message"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
              ></textarea>
          </div>

          <!-- Submit Button -->
          <div>
              <button 
                  type="submit"
                  class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                  Send
              </button>
          </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import emailjs from 'emailjs-com';
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const message = ref('');

const form = ref( {

  name:name.value,
  email:email.value,
  message:message.value
})

const sendEmail = (e) => {
  console.log('form',form.value);
  e.preventDefault(); // Empêche le rechargement de la page au submit

  try {
    emailjs.sendForm(
     'service_nbe1hrl','template_3f3pbur',e.target,'docXXA5nSoc2fZ_fY',{
          name: form.name,
          email: form.email,
          message: form.message
     }
     
    )
    
  } catch (error) {
    console.error("Erreur inattendue :", error);
  }

  // Réinitialiser les champs de formulaire
  form.value.name = '';
  form.value.email = '';
  form.value.message = '';
};
</script>

<style scoped>
/* Vous pouvez ajouter vos styles ici */
</style>
