require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Dossier pour tes fichiers CSS et images
app.use(express.static('public')); 

// Connexion à la base de données MongoDB (le lien sera dans un fichier .env caché)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à la base de données de la Liste !'))
  .catch(err => console.error(err));

// --- SCHÉMAS MONGODB ---

// Schéma Utilisateur
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'player' } // 'admin' ou 'player'
});
const User = mongoose.model('User', userSchema);

// Schéma Niveau
const levelSchema = new mongoose.Schema({
    placement: Number,
    name: String,
    creator: String,
    gd_id: String,
    video_url: String
});
const Level = mongoose.model('Level', levelSchema);

// --- ROUTES DE BASE ---

// Page d'accueil (Ta liste de niveaux)
app.get('/', async (req, res) => {
    // Récupère tous les niveaux triés par leur placement
    const levels = await Level.find().sort({ placement: 1 });
    // Ici, tu renverrais ton fichier HTML en y injectant les niveaux
    res.send("Bienvenue sur la Liste Custom de RedSoul0129 !"); 
});

// Route d'administration pour ajouter un niveau (Sécurisée plus tard)
app.post('/api/levels', async (req, res) => {
    const { placement, name, creator, gd_id, video_url } = req.body;
    const newLevel = new Level({ placement, name, creator, gd_id, video_url });
    await newLevel.save();
    res.json({ message: "Niveau Extreme Demon ajouté avec succès !", level: newLevel });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
