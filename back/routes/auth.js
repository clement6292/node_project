const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
    }

    // Hash du mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Vérifier si le username et le mot de passe sont fournis
    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe sont obligatoires.' });
    }

    // Trouver l'utilisateur dans la base de données
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Comparer le mot de passe fourni avec celui stocké (utilisation de bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Création des jetons JWT
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Sauvegarder le refresh token dans la base de données ou dans un système de stockage sécurisé (facultatif)
    // user.refreshToken = refreshToken; // Vous pouvez stocker le refresh token ici si vous le souhaitez
    // await user.save();

    // Retourner les jetons au client
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});

// Route pour renouveler le token d'accès avec le refresh token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  // Vérifier que le refresh token est présent
  if (!refreshToken) return res.status(403).json({ message: 'Refresh token manquant' });

  try {
    // Vérifier la validité du refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token de rafraîchissement invalide' });

      // Création d'un nouveau token d'accès
      const newAccessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Erreur lors du renouvellement du token:', error);
    res.status(500).json({ message: 'Erreur lors du renouvellement du token', error: error.message });
  }
});
module.exports = router;
