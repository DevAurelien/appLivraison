import { creerOuTrouverConversation, envoyerMessageCanal, envoyerMessagePrive, listerCanaux, listerConversations, listerMessages, listerMessagesCanal, rechercherSalariesMessagerie, recupererAvatarMessagerie } from "../services/gestion.messages.js";
import { get } from "@vercel/blob";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const idValide = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

export const controlRechercheSalariesMessagerie = async (req, res) => {
  const saisie = String(req.query.saisie || "").trim();
  if (saisie.length < 2) return res.status(400).json({ message: "Saisissez au moins 2 caractères" });
  try { return res.json({ donnees: await rechercherSalariesMessagerie(saisie, req.user.id) }); }
  catch (error) { console.error("RECHERCHE CONTACTS :", error); return res.status(500).json({ message: "Recherche impossible" }); }
};

export const controlCreerConversation = async (req, res) => {
  const contactId = Number(req.body.user_id);
  if (!idValide(contactId) || contactId === req.user.id) return res.status(400).json({ message: "Contact invalide" });
  try {
    const conversation = await creerOuTrouverConversation(req.user.id, contactId);
    return conversation ? res.status(201).json({ donnees: conversation }) : res.status(404).json({ message: "Salarié introuvable" });
  } catch (error) { console.error("CRÉATION CONVERSATION :", error); return res.status(500).json({ message: "Conversation impossible" }); }
};

export const controlListeConversations = async (req, res) => {
  try {
    const [privees, canaux] = await Promise.all([listerConversations(req.user.id), listerCanaux(req.user.id)]);
    const donnees = [...canaux, ...privees].sort((a, b) => new Date(b.dernier_message_le || 0) - new Date(a.dernier_message_le || 0));
    return res.json({ donnees });
  }
  catch (error) { console.error("LISTE CONVERSATIONS :", error); return res.status(500).json({ message: "Conversations indisponibles" }); }
};

export const controlListeMessagesCanal = async (req, res) => {
  if (!idValide(req.params.id)) return res.status(400).json({ message: "Canal invalide" });
  try {
    const messages = await listerMessagesCanal(Number(req.params.id), req.user.id);
    return messages ? res.json({ donnees: messages }) : res.status(403).json({ message: "Accès à ce canal interdit" });
  } catch (error) { console.error("LISTE MESSAGES CANAL :", error); return res.status(500).json({ message: "Messages indisponibles" }); }
};

export const controlEnvoiMessageCanal = async (req, res) => {
  const contenu = String(req.body.contenu || "").trim();
  if (!idValide(req.params.id) || !contenu || contenu.length > 2000) return res.status(400).json({ message: "Message invalide" });
  try {
    const message = await envoyerMessageCanal(Number(req.params.id), req.user.id, contenu);
    return message ? res.status(201).json({ donnees: message }) : res.status(403).json({ message: "Envoi interdit" });
  } catch (error) { console.error("ENVOI MESSAGE CANAL :", error); return res.status(500).json({ message: "Envoi impossible" }); }
};

export const controlAvatarMessagerie = async (req, res) => {
  if (!idValide(req.params.id)) return res.status(400).json({ message: "Utilisateur invalide" });
  try {
    const avatarUrl = await recupererAvatarMessagerie(req.user.id, Number(req.params.id));
    if (!avatarUrl) return res.sendStatus(404);
    const resultat = await get(avatarUrl, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!resultat?.stream || resultat.statusCode !== 200) return res.sendStatus(404);
    res.setHeader("Cache-Control", "private, max-age=300");
    res.setHeader("Content-Type", resultat.blob.contentType || "image/jpeg");
    return pipeline(Readable.fromWeb(resultat.stream), res);
  } catch (error) {
    console.error("AVATAR MESSAGERIE :", error);
    if (res.headersSent) return res.end();
    return res.status(500).json({ message: "Avatar indisponible" });
  }
};

export const controlListeMessages = async (req, res) => {
  if (!idValide(req.params.id)) return res.status(400).json({ message: "Conversation invalide" });
  try {
    const messages = await listerMessages(Number(req.params.id), req.user.id);
    return messages ? res.json({ donnees: messages }) : res.status(403).json({ message: "Accès à cette conversation interdit" });
  } catch (error) { console.error("LISTE MESSAGES :", error); return res.status(500).json({ message: "Messages indisponibles" }); }
};

export const controlEnvoiMessage = async (req, res) => {
  const contenu = String(req.body.contenu || "").trim();
  if (!idValide(req.params.id) || !contenu || contenu.length > 2000) return res.status(400).json({ message: "Message invalide" });
  try {
    const message = await envoyerMessagePrive(Number(req.params.id), req.user.id, contenu);
    return message ? res.status(201).json({ donnees: message }) : res.status(403).json({ message: "Envoi interdit" });
  } catch (error) { console.error("ENVOI MESSAGE :", error); return res.status(500).json({ message: "Envoi impossible" }); }
};
