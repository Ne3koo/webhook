// server.js

const express = require('express');
const fs = require('fs');
const moment = require('moment'); // Pour la gestion des dates
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour interpréter le JSON
app.use(express.json());

// Fonction pour obtenir le nom du fichier de log basé sur la date
const getLogFileName = () => {
    const date = moment().format('YYYY-MM-DD'); // Format de la date
    return path.join(__dirname, `logs_${date}.txt`); // Nom du fichier
};

// Endpoint du webhook
app.post('/webhook', (req, res) => {
    const { playerName } = req.body; // Assurez-vous que le nom du joueur est dans le corps de la requête

    if (!playerName) {
        return res.status(400).send('Nom du joueur manquant');
    }

    // Créer le log avec le format demandé
    const logEntry = `${moment().format('YYYY-MM-DD HH:mm:ss')} : ${playerName} : a utilisé le kit\n`;

    // Enregistrer le log dans le fichier approprié
    fs.appendFile(getLogFileName(), logEntry, (err) => {
        if (err) {
            console.error("Erreur lors de l'enregistrement du log:", err);
            return res.status(500).send('Erreur du serveur');
        }
        console.log('Log enregistré');
        res.status(200).send('Log reçu');
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
