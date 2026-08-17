import { put } from "@vercel/blob";
import { ajouterPhotoLivraison, declarerIncidentLivraison, finaliserLivraison, modifierStatutArticle, recupererLivraisons, verifierAccesLivraison } from "../services/gestion.deliveries.js";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

export const controlRecupDeliveries = async (req, res) => {
  try { return res.status(200).json(await recupererLivraisons(req.user.id)); }
  catch (error) { console.error("RÉCUPÉRATION LIVRAISONS :", error); return res.status(500).json({ message: "Livraisons indisponibles" }); }
};

export const controlModifierArticleLivraison = async (req, res) => {
  const statut = String(req.body.statut || "").toUpperCase();
  if (!idValide(req.params.id) || !idValide(req.params.operationId) || !["A_LIVRER", "LIVRE", "DEFECTUEUX", "NON_CONFORME"].includes(statut)) return res.status(400).json({ message: "Statut d’article invalide" });
  try {
    const article = await modifierStatutArticle(Number(req.params.id), Number(req.params.operationId), req.user.id, statut);
    return article ? res.json({ donnees: article }) : res.status(403).json({ message: "Modification interdite" });
  } catch (error) { console.error("STATUT ARTICLE :", error); return res.status(500).json({ message: "Modification impossible" }); }
};

export const controlFinaliserLivraison = async (req, res) => {
  const resultat = String(req.body.resultat || "").toUpperCase();
  const motif = String(req.body.motif_echec || "").trim();
  if (!idValide(req.params.id) || !["LIVREE", "ECHEC"].includes(resultat)) return res.status(400).json({ message: "Résultat invalide" });
  if (resultat === "ECHEC" && motif.length < 3) return res.status(400).json({ message: "Le motif de l’échec est obligatoire" });
  if (req.body.decharge_intervention === true) {
    const risque = String(req.body.decharge_risque || "").trim();
    const signataire = String(req.body.decharge_signataire || "").trim();
    if (risque.length < 10 || signataire.length < 3
      || req.body.decharge_accepte_risques !== true
      || req.body.decharge_conserve_produit !== true) {
      return res.status(400).json({ message: "La décharge doit être entièrement complétée et acceptée par le client" });
    }
  }
  try {
    const livraison = await finaliserLivraison(Number(req.params.id), req.user.id, { ...req.body, resultat, motif_echec: motif });
    return livraison ? res.json({ donnees: livraison }) : res.status(403).json({ message: "Validation interdite" });
  } catch (error) { console.error("FINALISATION LIVRAISON :", error); return res.status(500).json({ message: "Validation impossible" }); }
};

export const controlDeclarerIncidentLivraison = async (req, res) => {
  const type = String(req.body.type || "AUTRE").trim().slice(0, 60);
  const description = String(req.body.description || "").trim();
  if (!idValide(req.params.id) || description.length < 3 || description.length > 2000) return res.status(400).json({ message: "Description de l’incident invalide" });
  try {
    const incident = await declarerIncidentLivraison(Number(req.params.id), req.user.id, type, description);
    return incident ? res.status(201).json({ donnees: incident }) : res.status(403).json({ message: "Déclaration interdite" });
  } catch (error) { console.error("INCIDENT LIVRAISON :", error); return res.status(500).json({ message: "Déclaration impossible" }); }
};

export const controlAjouterPhotoLivraison = async (req, res) => {
  if (!idValide(req.params.id) || !req.file || !req.file.mimetype.startsWith("image/")) return res.status(400).json({ message: "Photo invalide" });
  try {
    if (!(await verifierAccesLivraison(Number(req.params.id), req.user.id))) return res.status(403).json({ message: "Ajout interdit" });
    const blob = await put(`livraisons/${req.params.id}/${crypto.randomUUID()}`, req.file.buffer, { access: "private", contentType: req.file.mimetype });
    const photo = await ajouterPhotoLivraison(Number(req.params.id), req.user.id, blob.url);
    return photo ? res.status(201).json({ donnees: photo }) : res.status(403).json({ message: "Ajout interdit" });
  } catch (error) { console.error("PHOTO LIVRAISON :", error); return res.status(500).json({ message: "Photo impossible à enregistrer" }); }
};
