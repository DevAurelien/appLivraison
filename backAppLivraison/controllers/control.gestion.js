import {
  affilierAgenceSalaries,
  affecterCamionAgence,
  creerCamion,
  modifierCamion,
  recupererCamions,
  supprimerCamion,
} from "../services/gestion.gestion.js";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const camionValide = (f) => (
  typeof f?.immatriculation === "string" && f.immatriculation.trim().length >= 7 &&
  typeof f?.marque === "string" && f.marque.trim() &&
  typeof f?.modele === "string" && f.modele.trim() &&
  idValide(f?.agence_id) && Number.isFinite(Number(f?.km)) && Number(f.km) >= 0 &&
  typeof f?.energie === "string" && typeof f?.statut === "string"
);

export const controlGestionSalaries = async (req, res) => {
  try {
    return res.status(200).json({ donnees: await affilierAgenceSalaries(req.user.id, 3) });
  } catch (e) {
    console.error("ERREUR AFFILIATION SALARIÉ :", e);
    return res.status(500).json({ message: "Erreur pendant l'affiliation" });
  }
};

export const controlCamion = async (req, res) => {
  if (!camionValide(req.body)) return res.status(400).json({ message: "Données du camion invalides" });
  try {
    return res.status(201).json({ donnees: await creerCamion(req.body) });
  } catch (e) {
    console.error("ERREUR CRÉATION CAMION :", e);
    return res.status(500).json({ message: "Erreur pendant la création du camion" });
  }
};

export const controlRecuperationCamions = async (req, res) => {
  try {
    return res.status(200).json({ donnees: await recupererCamions() });
  } catch (e) {
    console.error("ERREUR RÉCUPÉRATION CAMIONS :", e);
    return res.status(500).json({ message: "Erreur pendant la récupération des camions" });
  }
};

export const controlModificationCamion = async (req, res) => {
  if (!idValide(req.params.id) || !camionValide(req.body)) return res.status(400).json({ message: "Données du camion invalides" });
  try {
    const camion = await modifierCamion(req.params.id, req.body);
    return camion ? res.status(200).json({ donnees: camion }) : res.status(404).json({ message: "Camion introuvable" });
  } catch (e) {
    console.error("ERREUR MODIFICATION CAMION :", e);
    return res.status(500).json({ message: "Erreur pendant la modification du camion" });
  }
};

export const controlSuppressionCamion = async (req, res) => {
  if (!idValide(req.params.id)) return res.status(400).json({ message: "Identifiant du camion invalide" });
  try {
    const camion = await supprimerCamion(req.params.id);
    return camion ? res.status(200).json({ donnees: camion }) : res.status(404).json({ message: "Camion introuvable" });
  } catch (e) {
    console.error("ERREUR SUPPRESSION CAMION :", e);
    return res.status(500).json({ message: "Erreur pendant la suppression du camion" });
  }
};

export const controlAffectationCamionAgence = async (req, res) => {
  const camionId = Number(req.params.id);
  const agenceId = Number(req.body.agence_id);
  if (!idValide(camionId) || !idValide(agenceId)) {
    return res.status(400).json({ message: "Camion ou agence invalide" });
  }
  try {
    const camion = await affecterCamionAgence(camionId, agenceId);
    return camion
      ? res.status(200).json({ donnees: camion })
      : res.status(404).json({ message: "Camion introuvable" });
  } catch (e) {
    console.error("ERREUR AFFECTATION CAMION :", e);
    return res.status(500).json({ message: "Affectation du camion impossible" });
  }
};
