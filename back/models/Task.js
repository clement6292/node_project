const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  jour: {
    type: String,  // Utilisation d'une chaîne de caractères pour le jour
    enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    required: true,
  },
  isDeleted: {  // Champ pour la suppression logique
    type: Boolean,
    default: false,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });  // Le champ `timestamps` permet d'ajouter `createdAt` et `updatedAt`

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
