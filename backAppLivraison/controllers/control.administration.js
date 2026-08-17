import {
  listerRolesAdministrables,
  modifierRoleUtilisateur,
  rechercherUtilisateursAdministration,
  recupererIndicateursAdministration,
  recupererChiffreAffairesAgences,
} from "../services/gestion.administration.js";

export const controlChiffreAffairesAgences = async (req, res) => {
  const periode = ["mois", "annee", "30j"].includes(req.query.periode) ? req.query.periode : "mois";
  try {
    return res.status(200).json({ donnees: await recupererChiffreAffairesAgences(periode) });
  } catch (error) {
    console.error("ERREUR STATISTIQUES CHIFFRE AFFAIRES :", error);
    return res.status(500).json({ message: "Chargement du chiffre d’affaires impossible" });
  }
};

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

export const controlIndicateursAdministration = async (_req, res) => {
  try {
    return res.status(200).json({ donnees: await recupererIndicateursAdministration() });
  } catch (error) {
    console.error("ERREUR INDICATEURS ADMINISTRATION :", error);
    return res.status(500).json({ message: "Chargement des indicateurs impossible" });
  }
};

export const controlRechercheUtilisateursAdministration = async (req, res) => {
  const saisie = String(req.query.saisie || "").trim();
  if (saisie.length < 2) return res.status(400).json({ message: "Saisissez au moins 2 caractères" });
  try {
    return res.status(200).json({ donnees: await rechercherUtilisateursAdministration(saisie) });
  } catch (error) {
    console.error("ERREUR RECHERCHE UTILISATEURS :", error);
    return res.status(500).json({ message: "Recherche des utilisateurs impossible" });
  }
};

export const controlListeRolesAdministration = async (req, res) => {
  try {
    return res.status(200).json({ donnees: await listerRolesAdministrables(req.user.id) });
  } catch (error) {
    console.error("ERREUR LISTE RÔLES :", error);
    return res.status(500).json({ message: "Chargement des rôles impossible" });
  }
};

export const controlModificationRoleUtilisateur = async (req, res) => {
  const cibleId = Number(req.params.id);
  const roleId = Number(req.body.role_id);
  const motif = String(req.body.motif || "").trim();
  if (!idValide(cibleId) || !idValide(roleId)) return res.status(400).json({ message: "Utilisateur ou rôle invalide" });
  if (motif.length < 5 || motif.length > 500) return res.status(400).json({ message: "Le motif doit contenir entre 5 et 500 caractères" });
  try {
    const resultat = await modifierRoleUtilisateur(req.user.id, cibleId, roleId, motif);
    if (resultat.erreur) return res.status(resultat.statut).json({ message: resultat.erreur });
    return res.status(200).json({ message: "Rôle mis à jour", donnees: resultat.donnees });
  } catch (error) {
    console.error("ERREUR MODIFICATION RÔLE :", error);
    return res.status(500).json({ message: "Modification du rôle impossible" });
  }
};
