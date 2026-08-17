import {
  creeAgence,
  getListeAgences,
  modifierAgence,
  supprimerAgence,
} from "../services/gestion.agences.js";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
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
