const express = require('express');
const Task = require('../models/Task'); // Assurez-vous de créer un modèle Task dans /models/Task.js
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();



// Route POST pour créer une nouvelle tâche avec jour en tant que chaîne de caractères

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { description, jour } = req.body;
    const userId = req.user.userId;

    if (!description || !jour) {
      return res.status(400).json({ message: 'Description et jour sont obligatoires' });
    }

    // Vérification que le jour fait partie des jours valides
    const validDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    if (!validDays.includes(jour)) {
      return res.status(400).json({ message: 'Jour invalide' });
    }

    // Créer la tâche avec le jour comme chaîne de caractères
    const newTask = new Task({
      description,
      jour,  // Utilisation du jour comme chaîne de caractères
      userId,
    });

    await newTask.save();

    res.status(201).json(newTask);

  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
    res.status(500).json({ message: 'Erreur lors de la création de la tâche.', error: error.message });
  }
});


// Récupération de toutes les tâches d'un utilisateur
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }); // Récupérer les tâches liées à l'utilisateur connecté
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches.', error });
  }
});

// Récupération d'une tâche spécifique par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId }); // Vérifier si la tâche appartient à l'utilisateur
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la tâche.', error });
  }
});

// Mise à jour d'une tâche
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { description, jour } = req.body; // Modifier description et jour uniquement
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, // Trouver la tâche de l'utilisateur
      { description, jour },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.status(200).json({ message: 'Tâche mise à jour avec succès.', task });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche.', error });
  }
});


// Nouvelle route PATCH pour marquer une tâche comme supprimée (soft delete)
router.patch('/:id/soft-delete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, isDeleted: false }, // S'assurer que la tâche n'est pas déjà supprimée
      { isDeleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée ou déjà supprimée.' });
    res.status(200).json({ message: 'Tâche marquée comme supprimée.', task });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche.', error });
  }
});



// Nouvelle route PATCH pour restaurer une tâche supprimée (soft restore)
router.patch('/:id/restore', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, isDeleted: true }, // Vérifier que la tâche est supprimée
      { isDeleted: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée ou déjà restaurée.' });
    res.status(200).json({ message: 'Tâche restaurée avec succès.', task });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la restauration de la tâche.', error });
  }
});



// Suppression d'une tâche
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // Vérifier si la tâche appartient à l'utilisateur
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.status(200).json({ message: 'Tâche supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche.', error });
  }
});

module.exports = router;
