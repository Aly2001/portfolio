"""
Transforme chaque fiche en nombres (embedding) et les range dans index.json.
À relancer après « npm run fiches ». Seules les fiches qui ont changé
sont recalculées : on n'utilise pas le quota Gemini pour rien.

    python indexer.py
"""
import json
import os
from pathlib import Path

os.environ.setdefault("PAS_D_APP", "1")
from main import Gemini, MODELE_EMBEDDING  # noqa: E402

ICI = Path(__file__).parent
fiches = json.loads((ICI / "fiches.json").read_text(encoding="utf-8"))
chemin = ICI / "index.json"
ancien = json.loads(chemin.read_text(encoding="utf-8")) if chemin.exists() else {"fiches": []}
deja = {e["id"]: e for e in ancien["fiches"] if ancien.get("modele") == MODELE_EMBEDDING}

g = Gemini()
sortie, nouveaux = [], 0
for f in fiches:
    e = deja.get(f["id"])
    if e and e["empreinte"] == f["empreinte"]:
        sortie.append(e)
        continue
    vecteur = [round(x, 6) for x in g.embedding(f["texte"])]
    sortie.append({"id": f["id"], "empreinte": f["empreinte"], "vecteur": vecteur})
    nouveaux += 1
    print(f"  calculée : {f['id']}")

chemin.write_text(json.dumps({"modele": MODELE_EMBEDDING, "fiches": sortie}), encoding="utf-8")
print(f"{len(sortie)} fiches dans index.json ({nouveaux} recalculées).")
