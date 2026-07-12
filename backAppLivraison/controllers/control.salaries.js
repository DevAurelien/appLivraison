import { recupSalaries } from "../services/gestion.salaries.js"


export const controlSalaries = async (req, res)=>{
    const saisie = req.query.saisie;
    let salaries = await recupSalaries(saisie); 
    res.status(200).json({salaries}) 
}