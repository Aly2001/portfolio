"""
API de l'assistant du portfolio (« Information voyageurs »).

Le parcours d'une question :
  1. on vérifie la question (longueur) et les quotas ;
  2. on la transforme en nombres (embedding) ;
  3. on cherche les fiches les plus proches par le SENS ;
  4. si aucune n'est assez proche -> refus, SANS appeler Gemini ;
  5. Gemini répond à partir de ces fiches seulement ;
  6. le code vérifie la réponse (sources réelles, pas de numéro de téléphone).

Toutes les règles de sécurité sont appliquées par le CODE, jamais confiées à l'IA.
"""

from __future__ import annotations

import hashlib
import json
import logging
import math
import os
import re
import threading
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

log = logging.getLogger("assistant")
logging.basicConfig(level=logging.INFO)

ICI = Path(__file__).parent

# ── Réglages (modifiables sans toucher au code, par variables d'environnement) ──
MODELE_REPONSE = os.getenv("MODELE_REPONSE", "gemini-3.5-flash-lite")
MODELE_EMBEDDING = os.getenv("MODELE_EMBEDDING", "gemini-embedding-2")
SEUIL = float(os.getenv("SEUIL", "0.52"))            # 1er filtre : écarte le hors sujet (réglé avec calibrer.py)
NB_FICHES = int(os.getenv("NB_FICHES", "5"))          # fiches envoyées à Gemini
QUOTA_VISITEUR = int(os.getenv("QUOTA_VISITEUR", "10"))
QUOTA_GLOBAL = int(os.getenv("QUOTA_GLOBAL", "300"))
LONGUEUR_MIN, LONGUEUR_MAX = 2, 300
# Les modèles récents « réfléchissent » avant de répondre. Pour retrouver une
# information dans 5 fiches, la réflexion minimale suffit, et elle est bien plus rapide.
REFLEXION = os.getenv("REFLEXION", "minimal")         # minimal, low, medium, high, ou vide
DELAI_GEMINI_MS = int(os.getenv("DELAI_GEMINI_MS", "20000"))  # au-delà, on abandonne proprement
ORIGINES = os.getenv(
    "ORIGINES", "https://aly-keita-portfolio.web.app,http://localhost:5173"
).split(",")
SEL = os.getenv("SEL", "portfolio")                   # sert à rendre les IP illisibles
EMAIL = "alykeita295@gmail.com"

TELEPHONE = re.compile(r"(\+33|\b0)\s?[1-9](?:[\s.-]?\d{2}){4}")


# ── Chargement des fiches et de leurs embeddings ──
def charger_index(dossier: Path = ICI) -> tuple[list[dict], list[list[float]]]:
    """Charge fiches.json et index.json, et vérifie qu'ils correspondent.

    Règle générale : si une fiche a changé sans que l'index soit refait,
    on refuse de démarrer, plutôt que de répondre avec des données périmées.
    """
    fiches = json.loads((dossier / "fiches.json").read_text(encoding="utf-8"))
    index = json.loads((dossier / "index.json").read_text(encoding="utf-8"))
    par_id = {e["id"]: e for e in index["fiches"]}
    vecteurs = []
    for f in fiches:
        e = par_id.get(f["id"])
        if e is None or e["empreinte"] != f["empreinte"]:
            raise RuntimeError(
                f"La fiche « {f['id']} » a changé : relancez « python indexer.py »."
            )
        vecteurs.append(normaliser(e["vecteur"]))
    return fiches, vecteurs


def normaliser(v: list[float]) -> list[float]:
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


def proximite(a: list[float], b: list[float]) -> float:
    """Similarité cosinus (les deux vecteurs sont déjà normalisés)."""
    return sum(x * y for x, y in zip(a, b))


def chercher(question_vec, fiches, vecteurs, seuil=SEUIL, nb=NB_FICHES):
    q = normaliser(question_vec)
    notes = sorted(
        ((proximite(q, v), f) for v, f in zip(vecteurs, fiches)),
        key=lambda t: t[0],
        reverse=True,
    )
    return [(s, f) for s, f in notes[:nb] if s >= seuil]


# ── Quotas (en mémoire : le service tourne sur UNE seule instance) ──
class Quotas:
    def __init__(self, par_visiteur=QUOTA_VISITEUR, global_=QUOTA_GLOBAL):
        self.par_visiteur, self.global_ = par_visiteur, global_
        self._jour, self._visiteurs, self._total = None, {}, 0
        self._verrou = threading.Lock()

    def _remise_a_zero(self):
        jour = datetime.now(timezone.utc).date()
        if jour != self._jour:
            self._jour, self._visiteurs, self._total = jour, {}, 0

    def consommer(self, visiteur: str) -> int | None:
        """Retire une question du quota. Renvoie le nombre restant, ou None si épuisé."""
        with self._verrou:
            self._remise_a_zero()
            deja = self._visiteurs.get(visiteur, 0)
            if deja >= self.par_visiteur or self._total >= self.global_:
                return None
            self._visiteurs[visiteur] = deja + 1
            self._total += 1
            return self.par_visiteur - deja - 1


def identifiant_visiteur(request: Request) -> str:
    """L'IP n'est jamais gardée en clair : on n'en conserve qu'une empreinte."""
    transmis = request.headers.get("x-forwarded-for", "")
    ip = transmis.split(",")[0].strip() or (request.client.host if request.client else "?")
    return hashlib.sha256(f"{SEL}:{ip}".encode()).hexdigest()[:16]


# ── Gemini (isolé pour pouvoir le remplacer par un faux dans les tests) ──
CONSIGNE = f"""Tu es l'assistant du portfolio d'Aly Keita. Tu réponds aux recruteurs et aux visiteurs.
Règles strictes :
- Réponds UNIQUEMENT avec les informations des fiches fournies. N'invente rien.
- Si les fiches ne permettent pas de répondre, mets "trouve" à false.
- Parle d'Aly à la troisième personne, en français, en 2 à 4 phrases simples, sans mise en forme.
- Ne donne jamais de numéro de téléphone ni d'adresse postale. Pour le contacter : {EMAIL}.
- Dans "sources", liste les identifiants des fiches réellement utilisées.
"""

SCHEMA = {
    "type": "object",
    "properties": {
        "trouve": {"type": "boolean"},
        "reponse": {"type": "string"},
        "sources": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["trouve", "reponse", "sources"],
}


class Gemini:
    def __init__(self):
        from google import genai  # importé ici : les tests n'en ont pas besoin

        from google.genai import types

        # Délai maximal pour CHAQUE appel à Gemini : un visiteur n'attend jamais une minute.
        self.client = genai.Client(
            api_key=os.environ["GEMINI_API_KEY"], http_options=types.HttpOptions(timeout=DELAI_GEMINI_MS)
        )

    def embedding(self, texte: str) -> list[float]:
        r = self.client.models.embed_content(model=MODELE_EMBEDDING, contents=texte)
        return list(r.embeddings[0].values)

    def repondre(self, question: str, fiches: list[dict]) -> dict:
        from google.genai import types

        contexte = "\n\n".join(f"[{f['id']}] {f['texte']}" for f in fiches)
        r = self.client.models.generate_content(
            model=MODELE_REPONSE,
            contents=f"FICHES :\n{contexte}\n\nQUESTION : {question}",
            config=types.GenerateContentConfig(
                system_instruction=CONSIGNE,
                response_mime_type="application/json",
                response_schema=SCHEMA,
                temperature=0.2,
                max_output_tokens=1024,
                thinking_config=types.ThinkingConfig(thinking_level=REFLEXION) if REFLEXION else None,
                # Pas d'appels d'outils automatiques : l'IA ne fait que répondre.
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )
        if not r.text:  # réponse vide ou coupée : on le signale clairement
            raise ValueError(f"Réponse vide de Gemini (fin : {r.candidates[0].finish_reason if r.candidates else '?'})")
        return json.loads(r.text)


# ── Les réponses types (le même texte partout) ──
# Deux familles de refus, deux messages :
#  - hors sujet (arrêté par le seuil) : on rappelle à quoi sert l'assistant ;
#  - absent du CV (arrêté par la 2e barrière) : on renvoie vers Aly.
REFUS = {
    "hors-sujet": "Je réponds seulement aux questions sur le parcours, les compétences et les projets d'Aly. "
    "Essayez par exemple : « Parle-moi de Quai Nord ».",
    "absent": "Je n'ai pas cette information dans le CV d'Aly, et je préfère ne rien inventer. "
    "Le plus simple est de lui poser la question directement.",
}


def refus(restantes=None, famille="absent"):
    return {"statut": "refus", "reponse": REFUS[famille], "sources": [], "restantes": restantes}


LIMITE = {
    "statut": "limite",
    "reponse": f"Vous avez posé {QUOTA_VISITEUR} questions aujourd'hui, c'est la limite pour garder "
    "l'assistant gratuit pour tout le monde. Revenez demain, ou écrivez directement à Aly.",
    "sources": [],
    "restantes": 0,
}


# ── Les politesses : reconnues par le code, sans Gemini et sans toucher au quota ──
# Seulement quand le message entier est une politesse : « Bonjour, parle-moi de
# Quai Nord » reste une vraie question et suit le chemin normal.
POLITESSES = {
    "salut": ({"bonjour", "salut", "bonsoir", "hello", "coucou", "hi", "hey", "yo", "bjr", "slt"},
              "Bonjour ! Posez-moi une question sur le parcours, les compétences ou les projets d'Aly. Par exemple :"),
    "merci": ({"merci", "thanks", "thank you", "merci beaucoup", "merci bien", "mrc"},
              "Avec plaisir ! Une autre question sur Aly ? Par exemple :"),
    "revoir": ({"au revoir", "bye", "a bientot", "a plus", "bonne journee", "bonne soiree", "ciao"},
               "Merci de votre visite ! Pour continuer l'échange, vous pouvez écrire directement à Aly."),
    "accord": ({"ok", "okay", "d accord", "dac", "super", "parfait", "genial", "top", "cool", "tres bien"},
               "Parfait ! Une autre question ? Par exemple :"),
}


def simplifier(texte: str) -> str:
    """Minuscules, sans accents ni ponctuation : « Merci ! » et « merci » se ressemblent."""
    sans_accents = unicodedata.normalize("NFD", texte.lower()).encode("ascii", "ignore").decode()
    return " ".join(re.sub(r"[^a-z ]", " ", sans_accents).split())


def politesse(question: str):
    """Renvoie (famille, réponse) si le message entier n'est fait que de politesses.

    « merci Aly », « merci et au revoir », « bonjour, ça va ? » sont reconnus ;
    « Bonjour, parle-moi de Quai Nord » ne l'est pas : c'est une vraie question.
    """
    mots = [m for m in simplifier(question).split() if m != "aly"]
    texte = " ".join(mots).replace(" ca va", " et ca va")
    parties = [p.strip() for p in texte.split(" et ") if p.strip()]
    if not parties:
        return None
    familles = []
    for partie in parties:
        if partie in {"ca va", "comment ca va", "comment allez vous"}:
            familles.append("salut")
            continue
        famille = next((f for f, (formules, _) in POLITESSES.items() if partie in formules), None)
        if famille is None:
            return None
        familles.append(famille)
    famille = familles[-1]  # « merci et au revoir » : c'est l'au revoir qui compte
    return famille, POLITESSES[famille][1]


def traiter(question: str, visiteur: str, moteur, fiches, vecteurs, quotas: Quotas) -> dict:
    question = " ".join(question.split())
    if not (LONGUEUR_MIN <= len(question) <= LONGUEUR_MAX):
        return {"statut": "erreur", "reponse": f"Votre question doit faire entre {LONGUEUR_MIN} et {LONGUEUR_MAX} caractères.", "sources": [], "restantes": None}

    trouvee = politesse(question)
    if trouvee:
        famille, reponse = trouvee
        return {"statut": "politesse", "famille": famille, "reponse": reponse, "sources": [], "restantes": None}

    restantes = quotas.consommer(visiteur)
    if restantes is None:
        return LIMITE

    trouvees = chercher(moteur.embedding(question), fiches, vecteurs)
    if not trouvees:
        return refus(restantes, "hors-sujet")  # rien d'assez proche : on n'appelle même pas Gemini

    envoyees = [f for _, f in trouvees]
    brut = moteur.repondre(question, envoyees)

    # Vérifications par le code
    ids_envoyes = {f["id"]: f for f in envoyees}
    sources = [ids_envoyes[i] for i in dict.fromkeys(brut.get("sources", [])) if i in ids_envoyes]
    texte = str(brut.get("reponse", "")).strip()
    if not brut.get("trouve") or not sources or not texte or TELEPHONE.search(texte):
        return refus(restantes)

    # Plusieurs fiches peuvent pointer vers le même billet : on n'en montre qu'un.
    vues, billets = set(), []
    for f in sources:
        cle = f["source"]["ancre"]
        if cle not in vues:
            vues.add(cle)
            billets.append({"id": f["id"], **f["source"]})
    return {"statut": "ok", "reponse": texte, "sources": billets, "restantes": restantes}


# ── L'application web ──
class JSONUtf8(JSONResponse):
    """Annonce explicitement l'UTF-8 : sans cette précision, certains outils
    (comme PowerShell 5) lisent les accents de travers (« prÃ©voir »)."""

    media_type = "application/json; charset=utf-8"


class Question(BaseModel):
    question: str


def creer_app(moteur_fabrique: Callable = Gemini, dossier: Path = ICI) -> FastAPI:
    app = FastAPI(title="Assistant du portfolio", docs_url=None, redoc_url=None, default_response_class=JSONUtf8)
    app.add_middleware(
        CORSMiddleware, allow_origins=ORIGINES, allow_methods=["POST", "GET"], allow_headers=["Content-Type"]
    )
    fiches, vecteurs = charger_index(dossier)
    quotas = Quotas()
    etat = {"moteur": None}

    def moteur():
        if etat["moteur"] is None:
            etat["moteur"] = moteur_fabrique()
        return etat["moteur"]

    @app.get("/sante")
    def sante():
        return {"ok": True, "fiches": len(fiches)}

    @app.post("/question")
    def question(q: Question, request: Request):
        debut = time.monotonic()
        try:
            r = traiter(q.question, identifiant_visiteur(request), moteur(), fiches, vecteurs, quotas)
        except Exception:  # jamais de détail technique renvoyé au visiteur
            log.exception("Erreur pendant le traitement d'une question")
            r = {"statut": "erreur", "reponse": "L'assistant est momentanément indisponible. Vous pouvez écrire directement à Aly.", "sources": [], "restantes": None}
        # Une ligne par question : le statut et la durée, jamais le texte de la question.
        log.info("question traitée : statut=%s durée=%.1fs", r["statut"], time.monotonic() - debut)
        return r

    return app


if __name__ != "__main__" and os.getenv("PAS_D_APP") != "1":
    app = creer_app()
