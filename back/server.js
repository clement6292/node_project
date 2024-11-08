const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Assurez-vous que ce chemin est correct
const taskRoutes = require('./routes/tasks'); // Vérifiez ce chemin également
const cors = require('cors');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const connectToDatabase = async () => {
  try {
    // Connexion à MongoDB avec options supplémentaires
    await mongoose.connect(process.env.MONGODB_URI, {
    
      
    });

    console.log('Connecté à MongoDB');
  } catch (err) {
    // Gestion des erreurs de connexion
    console.error('Erreur de connexion à MongoDB:', err.message || err);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  }
};

// Exécution de la fonction de connexion
connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  // Gestion des erreurs globales
  console.error('Erreur:', err.stack);

  // Personnalisation du message d'erreur basé sur le type d'erreur
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors
    });
  }
  
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      message: 'Problème de connexion à la base de données MongoDB'
    });
  }

  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Le serveur s'exécute sur http://localhost:${PORT}`);
});
