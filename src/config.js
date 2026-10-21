// Adresse de l'API de l'assistant, lue dans le fichier .env.production.
// Si elle est absente, l'assistant affiche un message d'attente au lieu de planter.
export const ASSISTANT_URL = import.meta.env.VITE_ASSISTANT_URL || null
