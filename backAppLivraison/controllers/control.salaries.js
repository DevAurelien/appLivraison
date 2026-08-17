import {
  affecterEquipageCamion,
  affilierLivreurAgence,
  recupSalaries,
  recupImgSalaries,
  recupererAgenceCamion,
  recupererOrganisationAgence,
  rechercherLivreurs,
  verifierLivreursPourCamion,
} from "../services/gestion.salaries.js";
import { get } from "@vercel/blob";
import { Readable } from "node:stream";
import { sql } from "../database/db.js";

export const controlRecupSalaries = async (req, res) => {
  const saisie = req.query.saisie;
  const user = req.user;
if (user.role === "Client") {
  return res.status(403).json({
    message: "Accès interdit",
  });
}  const salaries = await recupSalaries(saisie, user.id);
  res.status(200).json({ salaries });
  // res.status(200).json({salaries:[{},{}],})
};


export const controlAfficherAvatarSalarie = async (req, res) => {
  try {
    const salarieId = req.params.id;

    const avatarUrl = await recupImgSalaries(salarieId);

    if (!avatarUrl) {
      return res.status(404).json({
        message: "Aucun avatar trouvé pour ce salarié",
      });
    }

    const pathname = new URL(avatarUrl).pathname.slice(1);

    const resultatBlob = await get(pathname, {
      access: "private",
      oidcToken: process.env.VERCEL_OIDC_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
    });

    res.setHeader("Content-Type", resultatBlob.blob.contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");

    Readable.fromWeb(resultatBlob.stream).pipe(res);
  } catch (error) {
    console.error("Erreur affichage avatar salarié :", error);

    return res.status(500).json({
      message: "Impossible de charger l'avatar du salarié",
    });
  }
};

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const agenceAutorisee = (req, agenceId) =>
  req.user.role_code !== "CHEF_AGENCE" || Number(req.user.agence_id) === Number(agenceId);

export const controlRechercheLivreurs = async (req, res) => {
  try {
    const livreurs = await rechercherLivreurs(String(req.query.saisie || ""));
    return res.status(200).json({ donnees: livreurs });
  } catch (e) {
    console.error("ERREUR RECHERCHE LIVREURS :", e);
    return res.status(500).json({ message: "Recherche des livreurs impossible" });
  }
};

export const controlAffiliationLivreurAgence = async (req, res) => {
  const { user_id, agence_id } = req.body;
  if (!idValide(user_id) || !idValide(agence_id)) {
    return res.status(400).json({ message: "Livreur ou agence invalide" });
  }
  if (!agenceAutorisee(req, agence_id)) {
    return res.status(403).json({ message: "Vous ne pouvez gérer que votre agence" });
  }
  try {
    const affiliation = await affilierLivreurAgence(Number(user_id), Number(agence_id));
    return affiliation
      ? res.status(200).json({ donnees: affiliation })
      : res.status(400).json({ message: "Cet utilisateur n'est pas déclaré comme salarié" });
  } catch (e) {
    console.error("ERREUR AFFILIATION LIVREUR :", e);
    return res.status(500).json({ message: "Affiliation du livreur impossible" });
  }
};

export const controlOrganisationAgence = async (req, res) => {
  const agenceId = Number(req.query.agence_id);
  if (!idValide(agenceId)) return res.status(400).json({ message: "Agence invalide" });
  if (!agenceAutorisee(req, agenceId)) {
    return res.status(403).json({ message: "Vous ne pouvez consulter que votre agence" });
  }
  try {
    return res.status(200).json({ donnees: await recupererOrganisationAgence(agenceId) });
  } catch (e) {
    console.error("ERREUR ORGANISATION AGENCE :", e);
    return res.status(500).json({ message: "Organisation de l'agence indisponible" });
  }
};

export const controlTousSalaries = async (req, res) => {
  try {
    const agenceId = req.user.role_code === "CHEF_AGENCE" ? Number(req.user.agence_id) : null;
    const organisation = await recupererOrganisationAgence(agenceId);
    return res.status(200).json({ donnees: organisation.livreurs });
  } catch (e) {
    console.error("ERREUR LISTE DES SALARIÉS :", e);
    return res.status(500).json({ message: "Liste des salariés indisponible" });
  }
};

export const controlAffectationEquipage = async (req, res) => {
  const camionId = Number(req.params.camionId);
  const userIds = Array.isArray(req.body.user_ids)
    ? [...new Set(req.body.user_ids.map(Number))]
    : [];
  if (!idValide(camionId) || userIds.length > 2 || userIds.some((id) => !idValide(id))) {
    return res.status(400).json({ message: "Un équipage contient au maximum deux livreurs" });
  }
  try {
    const agenceId = await recupererAgenceCamion(camionId);
    if (!agenceId) return res.status(404).json({ message: "Camion introuvable" });
    if (!agenceAutorisee(req, agenceId)) {
      return res.status(403).json({ message: "Vous ne pouvez gérer que votre agence" });
    }
    const valides = await verifierLivreursPourCamion(camionId, userIds);
    if (valides.length !== userIds.length) {
      return res.status(400).json({ message: "Les livreurs doivent appartenir à l'agence du camion" });
    }
    const affectations = await affecterEquipageCamion(camionId, userIds, req.user.id);
    return res.status(200).json({ donnees: affectations });
  } catch (e) {
    console.error("ERREUR AFFECTATION ÉQUIPAGE :", e);
    return res.status(500).json({ message: "Affectation de l'équipage impossible" });
  }
};
