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


@pytest.mark.parametrize("message,famille", [
    ("Bonjour", "salut"), ("bonjour !", "salut"), ("Salut ça va ?", "cava"), ("Bonjour Aly", "salut"),
    ("Merci", "merci"), ("Merci beaucoup !", "merci"), ("ok", "accord"),
    ("Au revoir", "revoir"), ("merci et au revoir", "revoir"),
])
def test_politesses_sans_gemini_ni_quota(dossier, message, famille):
    faux = FauxGemini()
    client = TestClient(main.creer_app(lambda: faux, dossier))
    for _ in range(main.QUOTA_VISITEUR + 2):  # les politesses ne consomment pas le quota
        r = client.post("/question", json={"question": message}).json()
    assert r["statut"] == "politesse" and r["famille"] == famille
    assert faux.appels_reponse == 0
    assert client.post("/question", json={"question": "Quelle expérience ?"}).json()["statut"] == "ok"


@pytest.mark.parametrize("message", ["Bonjour, parle-moi de Quai Nord", "Est-il ok pour un stage ?", "Super projet !"])
def test_vraies_questions_avec_mot_poli(dossier, message):
    assert poser(dossier, FauxGemini(), question=message)["statut"] != "politesse"


@pytest.mark.parametrize("message,famille", [
    ("Comment ça va ?", "cava"), ("Bonjour, ça va ?", "cava"), ("Tu vas bien ?", "cava"),
    ("Qui es-tu ?", "qui"), ("Que peux-tu faire ?", "qui"), ("aide", "qui"),
])
def test_nouvelles_politesses(dossier, message, famille):
    r = poser(dossier, FauxGemini(), question=message)
    assert r["statut"] == "politesse" and r["famille"] == famille


def test_les_messages_fixes_ne_parlent_jamais_du_cv():
    textes = list(main.REFUS.values()) + [main.LIMITE["reponse"]] + [r for _, r in main.POLITESSES.values()]
    for t in textes:
        assert "CV" not in t and "fiche" not in t.lower()


@pytest.mark.parametrize("brut,attendu", [
    ("D'après son CV, Aly a fait un stage.", "Aly a fait un stage."),
    ("Selon les fiches : il parle français.", "Il parle français."),
    ("Aly maîtrise Python (d'après son CV) et SQL.", "Aly maîtrise Python et SQL."),
    ("Son CV est téléchargeable sur le site.", "Son CV est téléchargeable sur le site."),
])
def test_la_reponse_ne_devoile_pas_sa_source(dossier, brut, attendu):
    faux = FauxGemini(reponse={"trouve": True, "reponse": brut, "sources": ["projet-a"]})
    assert poser(dossier, faux)["reponse"] == attendu


def test_refus_indique_sa_famille(dossier):
    assert poser(dossier, FauxGemini(vecteur=(-1, -1, -1)))["famille"] == "hors-sujet"
    faux = FauxGemini(reponse={"trouve": False, "reponse": "?", "sources": []})
    assert poser(dossier, faux)["famille"] == "absent"


class Erreur(Exception):
    def __init__(self, code):
        self.code = code


def test_modele_de_secours_si_surcharge():
    essais = []
    def appel(modele):
        essais.append(modele)
        if modele == "principal":
            raise Erreur(504)
        return {"ok": modele}
    assert main.avec_secours(appel, ["principal", "secours"]) == {"ok": "secours"}
    assert essais == ["principal", "secours"]


def test_pas_de_secours_si_erreur_de_notre_cote():
    essais = []
    def appel(modele):
        essais.append(modele)
        raise Erreur(400)  # requête mal formée : réessayer ne servirait à rien
    with pytest.raises(Erreur):
        main.avec_secours(appel, ["principal", "secours"])
    assert essais == ["principal"]


def test_les_deux_modeles_en_panne_donnent_un_message_clair(dossier):
    class TousEnPanne(FauxGemini):
        def repondre(self, q, f):
            return main.avec_secours(lambda m: (_ for _ in ()).throw(Erreur(503)), ["a", "b"])
    r = poser(dossier, TousEnPanne())
    assert r["statut"] == "erreur" and "indisponible" in r["reponse"]
