import { recupererLivraisons } from "../services/gestion.deliveries.js"
import pkg from 'jsonwebtoken';
const {sign, verify, decode} = pkg;

export const controlRecupDeliveries = async (req, res)=>{
    let jsonPret;
    try{
        if(req.params.id){
            jsonPret = await recupererLivraisons(req.params.id)
        }
        else {jsonPret = await recupererLivraisons();}
        res.json(jsonPret);
    }catch(e){
        console.error(e, "Une erreur est survenue")
        // res.status(500).json(e)
    }
    
}