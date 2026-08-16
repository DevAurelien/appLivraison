import { creeAgence, getListeAgences } from "../services/gestion.agences.js";

export const controlCreaAgences = async (req, res) => {
  try {
    const user = req.user;
    const { nom, nomComplet, heure_embauche } = req.body;
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


export const controlRecupAgences = async (req, res)=>{
  try{
    const listeAgences = await getListeAgences();
    return res.status(200).json(listeAgences);
  }catch(e){
    console.log(e)
    res.status(500).json({error : `Une erreur est survenue pendant la recuperation des agences ${e}`})
  }
}