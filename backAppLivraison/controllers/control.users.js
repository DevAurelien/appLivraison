import { creerUser, verifierUser, signerJwt } from "../services/gestion.users.js";

export const ControlPostUsers = async (req, res) => {
    let  {email,password} = req.body;
  email = email.trim();
  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Le mot de passe ou le mail sont incorrects" });
  }

  let verifierUtilisateur = await verifierUser(email, password);
  if(!verifierUtilisateur){
    creerUser(email, password);
  }
  if(verifierUtilisateur){
    try {
      const signer = await signerJwt(email)
      signer && res.json({jwt:signer})
    }
    catch(e){
      res.status(500).json({message:`${e}, une erreur s'est produite`})
    }
  }
  // else{
  //   res.status(400).json({message:"Utilisateur inconnu, veuillez réessayer"})
  // }
};

export const ControlGetUsers = async (req, res)=>{
    
}