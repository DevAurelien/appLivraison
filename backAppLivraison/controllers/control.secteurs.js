import {
  affilierSecteur,
  modifierSecteur,
  recupererSecteurs,
  supprimerSecteur,
} from "../services/gestion.secteurs.js";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const donneesSecteurValides = ({
  nom,
  agence_id,
  jour_livraison,
  couleur,
  geometrie,
}) => (
  typeof nom === "string" &&
  nom.trim().length > 0 &&
  idValide(agence_id) &&
  typeof jour_livraison === "string" &&
  jour_livraison.trim().length > 0 &&
  typeof couleur === "string" &&
  couleur.trim().length > 0 &&
  geometrie?.type === "Polygon" &&
  Array.isArray(geometrie.coordinates) &&
  geometrie.coordinates.length > 0
);

export const controlCreationSecteurs = async (req, res) => {
  const { nom, agence_id, jour_livraison, couleur, geometrie } = req.body;

  try {
    const all = await affilierSecteur({
      nom,
      agence_id,
      jour_livraison,
      couleur,
      geometrie,
    });

    return res.status(200).json({
      donnees: all,
    });
  } catch (e) {
    console.error("ERREUR CREATION SECTEUR :", e);

    return res.status(500).json({
      error: `Une erreur est survenue pendant la creation du secteur ${e}`,
    });
  }
};

export const controlRecupSecteurs = async (req, res) => {
  const { agence_id } = req.query;

  try {
    if (!agence_id) {
      return res.status(400).json({
        error: "L'agence est obligatoire",
      });
    }

    const secteurs = await recupererSecteurs(Number(agence_id));

    return res.status(200).json({
      donnees: secteurs,
    });
  } catch (e) {
    console.error("ERREUR RECUPERATION SECTEURS :", e);

    return res.status(500).json({
      error: "Une erreur est survenue pendant la recuperation des secteurs",
    });
  }
};

export const controlModificationSecteur = async (req, res) => {
  const { id } = req.params;
  const { nom, agence_id, jour_livraison, couleur, geometrie } = req.body;

  if (!idValide(id)) {
    return res.status(400).json({ error: "Identifiant du secteur invalide" });
  }

  if (!donneesSecteurValides(req.body)) {
    return res.status(400).json({
      error: "Les donnees du secteur sont incompletes ou invalides",
    });
  }

  try {
    const secteur = await modifierSecteur({
      id: Number(id),
      nom: nom.trim(),
      agence_id: Number(agence_id),
      jour_livraison,
      couleur,
      geometrie,
    });

    if (!secteur) {
      return res.status(404).json({ error: "Secteur introuvable" });
    }

    return res.status(200).json({ donnees: secteur });
  } catch (e) {
    console.error("ERREUR MODIFICATION SECTEUR :", e);
    return res.status(500).json({
      error: "Une erreur est survenue pendant la modification du secteur",
    });
  }
};

export const controlSuppressionSecteur = async (req, res) => {
  const { id } = req.params;

  if (!idValide(id)) {
    return res.status(400).json({ error: "Identifiant du secteur invalide" });
  }

  try {
    const secteur = await supprimerSecteur(Number(id));

    if (!secteur) {
      return res.status(404).json({ error: "Secteur introuvable" });
    }

    return res.status(200).json({ donnees: secteur });
  } catch (e) {
    console.error("ERREUR SUPPRESSION SECTEUR :", e);
    return res.status(500).json({
      error: "Une erreur est survenue pendant la suppression du secteur",
    });
  }
};
