import { creeAgence } from "../services/gestion.agences.js";

export const controlCreaAgences = async (req, res) => {
  try {
    const user = req.user;
    const { nom, nomComplet, heure_embauche } = req.body;
    console.log(req.body)
    const reponse = await creeAgence(
      nom,
      nomComplet,
      heure_embauche,
      user.id,
    );
    res.status(200).json(reponse);
  } catch (e) {
    console.log(e);
    res.status(500).json({error : `Une erreur est survenue pendant la creation de l'agence ${e}`})
  }
};
