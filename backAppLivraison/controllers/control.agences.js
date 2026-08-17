import {
  creeAgence,
  getListeAgences,
  modifierAgence,
  supprimerAgence,
} from "../services/gestion.agences.js";
import { affecterCamionTournee, recupererTourneesEtCamionsAgence } from "../services/gestion.tournees.js";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const agenceAutorisee = (req, agenceId) =>
  req.user.role_code !== "CHEF_AGENCE" || Number(req.user.agence_id) === Number(agenceId);
const donneesValides = ({ nom, nomComplet, heure_embauche }) =>
  typeof nom === "string" && nom.trim().length > 0 &&
  typeof nomComplet === "string" && nomComplet.trim().length > 0 &&
  typeof heure_embauche === "string" && /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(heure_embauche);

export const controlCreaAgences = async (req, res) => {
  try {
    const user = req.user;
    const { nom, nomComplet, heure_embauche } = req.body;
    if (!donneesValides(req.body)) {
      return res.status(400).json({ error: "Données de l'agence invalides" });
    }
    const reponse = await creeAgence(
      nom,
      nomComplet,
      heure_embauche,
      user.id,
    );
    res.status(201).json(reponse);
  } catch (e) {
    console.log(e);
    res.status(500).json({error : `Une erreur est survenue pendant la creation de l'agence ${e}`})
  }
};


export const controlRecupAgences = async (req, res)=>{
  try{
    const listeAgences = await getListeAgences();
    return res.status(200).json(listeAgences);
  }catch(e){
    console.log(e)
    res.status(500).json({error : `Une erreur est survenue pendant la recuperation des agences ${e}`})
  }
}

export const controlModificationAgence = async (req, res) => {
  if (!idValide(req.params.id) || !donneesValides(req.body)) {
    return res.status(400).json({ error: "Données de l'agence invalides" });
  }

  try {
    const agence = await modifierAgence(
      Number(req.params.id),
      req.body.nom.trim(),
      req.body.nomComplet.trim(),
      req.body.heure_embauche,
      req.user.id,
    );
    return agence
      ? res.status(200).json(agence)
      : res.status(404).json({ error: "Agence introuvable" });
  } catch (e) {
    console.error("ERREUR MODIFICATION AGENCE :", e);
    return res.status(500).json({ error: "Erreur pendant la modification de l'agence" });
  }
};

export const controlSuppressionAgence = async (req, res) => {
  if (!idValide(req.params.id)) {
    return res.status(400).json({ error: "Identifiant de l'agence invalide" });
  }

  try {
    const agence = await supprimerAgence(Number(req.params.id));
    return agence
      ? res.status(200).json(agence)
      : res.status(404).json({ error: "Agence introuvable" });
  } catch (e) {
    console.error("ERREUR SUPPRESSION AGENCE :", e);
    if (e.code === "23503") {
      return res.status(409).json({
        error: "Cette agence est encore utilisée et ne peut pas être supprimée",
      });
    }
    return res.status(500).json({ error: "Erreur pendant la suppression de l'agence" });
  }
};

export const controlOrganisationTourneesAgence = async (req, res) => {
  const agenceId = Number(req.params.id);
  if (!idValide(agenceId)) return res.status(400).json({ message: "Agence invalide" });
  if (!agenceAutorisee(req, agenceId)) return res.status(403).json({ message: "Vous ne pouvez gérer que votre agence" });
  try {
    return res.status(200).json({ donnees: await recupererTourneesEtCamionsAgence(agenceId) });
  } catch (error) {
    console.error("ERREUR TOURNÉES AGENCE :", error);
    return res.status(500).json({ message: "Chargement des tournées impossible" });
  }
};

export const controlAffectationCamionTournee = async (req, res) => {
  const agenceId = Number(req.params.id);
  const tourneeId = Number(req.params.tourneeId);
  const camionId = Number(req.body.camion_id);
  if (![agenceId, tourneeId, camionId].every(idValide)) {
    return res.status(400).json({ message: "Agence, tournée ou camion invalide" });
  }
  if (!agenceAutorisee(req, agenceId)) return res.status(403).json({ message: "Vous ne pouvez gérer que votre agence" });
  try {
    const tournee = await affecterCamionTournee(agenceId, tourneeId, camionId);
    return tournee
      ? res.status(200).json({ donnees: tournee })
      : res.status(400).json({ message: "Le camion doit appartenir à l’agence et la tournée doit être modifiable" });
  } catch (error) {
    console.error("ERREUR AFFECTATION CAMION TOURNÉE :", error);
    return res.status(500).json({ message: "Affectation du camion impossible" });
  }
};
