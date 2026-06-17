import { creerUser, verifierUser, signerJwt } from "../services/gestion.users.js";

export const controlUsers = async (req, res) => {
    let  {email,password} = req.body;
  email = email.trim();
  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Le mot de passe ou le mail sont incorrects" });
  }

  let verifierUtilisateur = await verifierUser(email, password);
//   if(!verifierUtilisateur){
//     creerUser(email, password);
//   }
  if(verifierUtilisateur){
    signerJwt(email, password)
  }
};
