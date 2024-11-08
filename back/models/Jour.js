const mongoose = require('mongoose');
const jourSchema = new mongoose.Schema({
    jour: {
      type: String,
      enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      required: true
    }
  }, { timestamps: true });


const Jour = mongoose.model('Jour', jourSchema);
module.exports = Jour;