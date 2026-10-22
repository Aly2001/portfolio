"""
Vérifie l'assistant de bout en bout sur des questions d'essai.

Il y a DEUX barrières, et chaque famille de question doit être arrêtée
par la bonne :
  - « repond »      : question sur Aly, réponse dans le CV  -> statut ok
  - « hors-sujet »  : rien à voir avec Aly                  -> arrêtée par le SEUIL,
                                                               sans appeler Gemini
  - « absent »      : sur Aly, mais pas dans le CV           -> passe le seuil, puis
                                                               Gemini dit « pas trouvé »
                                                               et le code refuse

    python calibrer.py
"""
import os
import time

os.environ.setdefault("PAS_D_APP", "1")
from main import Gemini, Quotas, SEUIL, charger_index, chercher, traiter  # noqa: E402

QUESTIONS = [
    ("Quelle expérience en machine learning ?", "repond"),
    ("Parle-moi de Quai Nord", "repond"),
    ("Quelles technologies cloud ?", "repond"),
    ("Est-il disponible pour un stage ?", "repond"),
    ("Où a-t-il fait sa licence ?", "repond"),
    ("Comment fonctionne Nora ?", "repond"),
    ("Quelles langues parle-t-il ?", "repond"),
    ("Quel est son salaire attendu ?", "absent"),
    ("Quel est son numéro de téléphone ?", "absent"),
    ("Est-il marié ?", "absent"),
    ("Quelle est la capitale de l'Australie ?", "hors-sujet"),
    ("Donne-moi une recette de crêpes", "hors-sujet"),
]

# Google limite le nombre de demandes PAR MINUTE. Pour ne pas déclencher ce frein :
#  - chaque question n'est transformée en nombres qu'une seule fois (mémoire) ;
#  - une courte pause sépare les questions.
PAUSE = 4  # secondes


class Memoire:
    def __init__(self, moteur):
        self.moteur, self.deja = moteur, {}

    def embedding(self, texte):
        if texte not in self.deja:
            self.deja[texte] = self.moteur.embedding(texte)
        return self.deja[texte]

    def repondre(self, question, fiches):
        return self.moteur.repondre(question, fiches)


fiches, vecteurs = charger_index()
g = Memoire(Gemini())
quotas = Quotas(par_visiteur=1000, global_=1000)
print(f"Seuil actuel : {SEUIL}\n")
bilan = 0
for n, (q, famille) in enumerate(QUESTIONS):
    if n:
        time.sleep(PAUSE)
    debut = time.monotonic()
    try:
        note = chercher(g.embedding(q), fiches, vecteurs, seuil=-1, nb=1)[0][0]
        r = traiter(q, "calibrage", g, fiches, vecteurs, quotas)
    except Exception as e:  # une question en échec n'arrête pas tout le calibrage
        print(f"[ERREUR ] {q} -> {type(e).__name__} après {time.monotonic() - debut:.1f}s")
        continue
    duree = time.monotonic() - debut
    if famille == "repond":
        bon = r["statut"] == "ok"
    elif famille == "hors-sujet":
        bon = r["statut"] == "refus" and note < SEUIL      # arrêtée dès la 1re barrière
    else:
        bon = r["statut"] == "refus"                       # arrêtée par l'une ou l'autre
    bilan += bon
    print(f"[{'ok ' if bon else 'À REVOIR'}] {note:.3f}  {duree:4.1f}s  {famille:<10}  {q}")
    print(f"           -> {r['statut']} : {r['reponse'][:110]}")
print(f"\n{bilan}/{len(QUESTIONS)} questions traitées comme prévu.")
