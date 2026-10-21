"""Tests des règles de sécurité, avec un faux Gemini (aucun appel réseau)."""
import json

import pytest
from fastapi.testclient import TestClient

import main

FICHES = [
    {"id": "projet-a", "texte": "machine learning", "empreinte": "aa", "source": {"libelle": "A", "sous": "BILLET 1", "ancre": "#billet-a"}},
    {"id": "projet-b", "texte": "cloud", "empreinte": "bb", "source": {"libelle": "B", "sous": "BILLET 2", "ancre": "#billet-b"}},
    {"id": "projet-b2", "texte": "cloud bis", "empreinte": "cc", "source": {"libelle": "B", "sous": "BILLET 2", "ancre": "#billet-b"}},
]
VECTEURS = {"projet-a": [1, 0, 0], "projet-b": [0, 1, 0], "projet-b2": [0, 0.9, 0.1]}


class FauxGemini:
    """Renvoie un embedding choisi et une réponse choisie, et compte les appels."""

    def __init__(self, vecteur=(1, 0, 0), reponse=None):
        self.vecteur, self.reponse, self.appels_reponse = list(vecteur), reponse, 0

    def embedding(self, texte):
        return self.vecteur

    def repondre(self, question, fiches):
        self.appels_reponse += 1
        return self.reponse or {"trouve": True, "reponse": "Il fait du ML.", "sources": [fiches[0]["id"]]}


@pytest.fixture
def dossier(tmp_path):
    (tmp_path / "fiches.json").write_text(json.dumps(FICHES), encoding="utf-8")
    index = {"modele": "x", "fiches": [{"id": f["id"], "empreinte": f["empreinte"], "vecteur": VECTEURS[f["id"]]} for f in FICHES]}
    (tmp_path / "index.json").write_text(json.dumps(index), encoding="utf-8")
    return tmp_path


def poser(dossier, faux, question="Quelle expérience en ML ?", fois=1):
    client = TestClient(main.creer_app(lambda: faux, dossier))
    r = None
    for _ in range(fois):
        r = client.post("/question", json={"question": question}).json()
    return r


def test_reponse_normale_avec_sources(dossier):
    r = poser(dossier, FauxGemini())
    assert r["statut"] == "ok"
    assert r["sources"] == [{"id": "projet-a", "libelle": "A", "sous": "BILLET 1", "ancre": "#billet-a"}]


def test_question_hors_sujet_refusee_sans_appeler_gemini(dossier):
    faux = FauxGemini(vecteur=(-1, -1, -1))
    r = poser(dossier, faux)
    assert r["statut"] == "refus"
    assert faux.appels_reponse == 0
    assert r["reponse"] == main.REFUS["hors-sujet"]


def test_source_inventee_retiree_puis_refus(dossier):
    faux = FauxGemini(reponse={"trouve": True, "reponse": "Bla.", "sources": ["fiche-qui-n-existe-pas"]})
    assert poser(dossier, faux)["statut"] == "refus"


def test_gemini_dit_ne_pas_savoir(dossier):
    faux = FauxGemini(reponse={"trouve": False, "reponse": "Je ne sais pas.", "sources": ["projet-a"]})
    r = poser(dossier, faux)
    assert r["statut"] == "refus" and r["reponse"] == main.REFUS["absent"]


@pytest.mark.parametrize("numero", ["07 53 16 82 80", "0753168280", "+33 7 53 16 82 80", "07.53.16.82.80"])
def test_aucun_numero_de_telephone_ne_sort(dossier, numero):
    faux = FauxGemini(reponse={"trouve": True, "reponse": f"Appelez le {numero}.", "sources": ["projet-a"]})
    assert poser(dossier, faux)["statut"] == "refus"


def test_billets_en_double_fusionnes(dossier):
    faux = FauxGemini(vecteur=(0, 1, 0), reponse={"trouve": True, "reponse": "Cloud.", "sources": ["projet-b", "projet-b2"]})
    r = poser(dossier, faux)
    assert [s["ancre"] for s in r["sources"]] == ["#billet-b"]


def test_quota_par_visiteur(dossier):
    r = poser(dossier, FauxGemini(), fois=main.QUOTA_VISITEUR + 1)
    assert r["statut"] == "limite"


@pytest.mark.parametrize("question", ["", "a", "x" * 301])
def test_longueur_de_question(dossier, question):
    assert poser(dossier, FauxGemini(), question=question)["statut"] == "erreur"


def test_index_perime_bloque_le_demarrage(dossier):
    fiches = json.loads((dossier / "fiches.json").read_text())
    fiches[0]["empreinte"] = "modifiee"
    (dossier / "fiches.json").write_text(json.dumps(fiches))
    with pytest.raises(RuntimeError, match="indexer"):
        main.creer_app(lambda: FauxGemini(), dossier)


def test_erreur_technique_jamais_affichee(dossier):
    class EnPanne(FauxGemini):
        def repondre(self, q, f):
            raise ValueError("détail interne secret")
    r = poser(dossier, EnPanne())
    assert r["statut"] == "erreur" and "secret" not in r["reponse"]


def test_reponses_annoncees_en_utf8(dossier):
    client = TestClient(main.creer_app(lambda: FauxGemini(), dossier))
    for r in (client.get("/sante"), client.post("/question", json={"question": "Quelle expérience ?"})):
        assert r.headers["content-type"] == "application/json; charset=utf-8"
