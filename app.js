const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Utilisez votre token GitHub ici (remplacez 'your-token-here' par votre token GitHub)
const GITHUB_TOKEN = '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'; // Remplacez par votre token d'accès personnel

// Middleware pour servir des fichiers statiques (HTML, CSS, JS)
app.use(express.static('public')); // Assurez-vous que votre fichier HTML, CSS, et JS sont dans un dossier 'public'

/**
 * Fonction pour vérifier si un utilisateur a forké le dépôt
 */
async function checkIfForked(username) {
  const repositoryOwner = 'kgtech-cmr'; // Remplacez par le nom d'utilisateur ou l'organisation propriétaire du dépôt
  const repositoryName = 'KERM_MD-V4'; // Remplacez par le nom du dépôt

  // URL GitHub API pour vérifier les forks
  const apiUrl = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/forks`;

  try {
    // Requête vers l'API GitHub pour récupérer la liste des forks
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`, // Authentification avec le token
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

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
