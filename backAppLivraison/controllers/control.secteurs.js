import { getListeAgences } from "../services/gestion.agences.js";

export const controlCreationSecteurs =async (req, res)=> {
    const {nom, jour_livraison, couleur, geometrie} = req.body;
    const listeAgences = await getListeAgences();


    // nom,
    // agence_id,
    // jour_livraison,
    // couleur,
    // geometrie

    return listeAgences;
}