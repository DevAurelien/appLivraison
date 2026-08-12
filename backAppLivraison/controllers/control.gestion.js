import { affilierAgenceSalaries, creerCamion } from "../services/gestion.gestion.js";

export const controlGestionSalaries = async (req, res) =>{
    const agence_id = 3 // villeneuve
    const user = req.user;

    const ok = affilierAgenceSalaries(user.id, agence_id);
    
    console.log(ok)
}

export const controlCamion = async (req, res)=>{
    const formulaire = req.body;
    // console.log(formulaire);
    try{
        creerCamion(formulaire);
    }catch(e){
        console.log(e)
    }

}