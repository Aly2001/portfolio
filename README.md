# Portfolio d'Aly Keita

Site React + Vite, thème « Grand hall ».

## Lancer le site sur son ordinateur
    npm install
    npm run dev
Puis ouvrir http://localhost:5173

## Où changer le contenu
Tout le texte est dans src/data/profil.js (source unique).
- cvUrl : chemin du CV public (sans téléphone), à déposer dans public/. null = boutons CV masqués.
- direct.pourcentageRisque : chiffre en direct de Quai Nord. null = pas de chiffre affiché.
- etat d'un projet : 'en-ligne', 'en-cours' ou 'termine'.

## Où changer le style
Tout est dans src/styles.css ; couleurs et polices en haut du fichier.
