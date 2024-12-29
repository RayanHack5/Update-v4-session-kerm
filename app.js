const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Middleware pour servir des fichiers statiques (HTML, CSS, JS)
app.use(express.static('public')); // Assurez-vous que votre fichier HTML, CSS, et JS sont dans un dossier 'public'

/**
 * Fonction pour vérifier si un utilisateur a forké le dépôt
 */
async function checkIfForked(username) {
  const repositoryOwner = 'Kgtech-cmr'; // Remplacez par le nom d'utilisateur ou l'organisation propriétaire du dépôt
  const repositoryName = 'KERM_MD-V4'; // Remplacez par le nom du dépôt

  // URL GitHub API pour vérifier les forks
  const apiUrl = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/forks`;

  try {
    const response = await fetch(apiUrl);
    const forks = await response.json();
    
    // Vérifier si le nom d'utilisateur est dans la liste des forks
    const isForked = forks.some(fork => fork.owner.login === username);

    return isForked;
  } catch (error) {
    console.error('Erreur lors de la vérification du fork :', error);
    return false;
  }
}

/**
 * Route de vérification du fork
 */
app.get('/checkFork/:username', async (req, res) => {
  const username = req.params.username;

  // Vérification si l'utilisateur a forké le dépôt
  const isForked = await checkIfForked(username);

  // Réponse au front-end
  res.json({ forked: isForked });
});

/**
 * Lancer l'application
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
