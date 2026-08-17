import { listerMessagesPourUtilisateur, publierMessageDiffusion, rechercherCiblesUtilisateurs, recupererCiblesDiffusion, utilisateurPeutPublier } from "../services/gestion.messagesDiffusion.js";

export const controlMessagesAccueil = async (req, res) => {
  try { return res.json({ donnees: await listerMessagesPourUtilisateur(req.user.id) }); }
  catch (error) { console.error("MESSAGES ACCUEIL :", error); return res.status(500).json({ message: "Informations indisponibles" }); }
};
export const controlCiblesDiffusion = async (req, res) => {
  try {
    if (!(await utilisateurPeutPublier(req.user.id))) return res.status(403).json({ message: "Publication non autorisée" });
    return res.json({ donnees: await recupererCiblesDiffusion() });
  } catch (error) { console.error("CIBLES DIFFUSION :", error); return res.status(500).json({ message: "Cibles indisponibles" }); }
};
export const controlRechercheCiblesDiffusion = async (req, res) => {
  const saisie = String(req.query.saisie || "").trim();
  if (saisie.length < 2) return res.status(400).json({ message: "Saisissez au moins 2 caractères" });
  try {
    if (!(await utilisateurPeutPublier(req.user.id))) return res.status(403).json({ message: "Recherche non autorisée" });
    return res.json({ donnees: await rechercherCiblesUtilisateurs(saisie, req.user.id) });
  } catch (error) { console.error("RECHERCHE CIBLE DIFFUSION :", error); return res.status(500).json({ message: "Recherche impossible" }); }
};
export const controlPublierMessageDiffusion = async (req, res) => {
  const titre = String(req.body.titre || "").trim();
  const contenu = String(req.body.contenu || "").trim();
  const cibleType = String(req.body.cible_type || "");
  if (titre.length < 2 || titre.length > 120 || contenu.length < 3 || contenu.length > 2000
    || !["TOUS_SALARIES", "TOUS_CLIENTS", "AGENCE", "ROLE", "UTILISATEUR"].includes(cibleType)) return res.status(400).json({ message: "Message ou cible invalide" });
  if ((cibleType === "AGENCE" && !req.body.cible_agence_id) || (cibleType === "ROLE" && !req.body.cible_role_id) || (cibleType === "UTILISATEUR" && !req.body.cible_user_id)) return res.status(400).json({ message: "Sélectionnez précisément la cible" });
  try {
    const message = await publierMessageDiffusion(req.user.id, { ...req.body, titre, contenu, cible_type: cibleType });
    return message ? res.status(201).json({ donnees: message }) : res.status(403).json({ message: "Publication non autorisée" });
  } catch (error) { console.error("PUBLICATION MESSAGE :", error); return res.status(500).json({ message: "Publication impossible" }); }
};
