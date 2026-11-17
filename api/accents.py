"""
Fabrique accents.json : la table « mot sans accent -> mot accentué » du français.

Source : le dictionaire de fréquences du paquet pyspellchecker (licence MIT).
Un mot sans accent est remplacé seulement s'il n'existe pas en français (« maitrise »,
« dedie »), ou si sa forme accentuée est au moins 20 fois plus courante (« cotes » -> « côtés »).
« a / à », « ou / où », « la / là » ne sont donc jamais touchés : les deux formes sont courantes.

    pip install pyspellchecker
    python accents.py
"""
import json
import unicodedata

from spellchecker import SpellChecker

RAPPORT = 20

frequences = SpellChecker(language="fr").word_frequency.dictionary
meilleur: dict[str, tuple[str, int]] = {}
for mot, n in frequences.items():
    nu = unicodedata.normalize("NFD", mot).encode("ascii", "ignore").decode()
    if nu != mot and nu.isalpha() and (nu not in meilleur or n > meilleur[nu][1]):
        meilleur[nu] = (mot, n)

table = {nu: mot for nu, (mot, n) in meilleur.items() if n >= RAPPORT * frequences.get(nu, 0)}
with open("accents.json", "w", encoding="utf-8") as f:
    json.dump(table, f, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
print(f"{len(table)} mots dans accents.json")
