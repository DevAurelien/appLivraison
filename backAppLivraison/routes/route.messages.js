import express from "express";
import { controlAvatarMessagerie, controlCreerConversation, controlEnvoiMessage, controlEnvoiMessageCanal, controlListeConversations, controlListeMessages, controlListeMessagesCanal, controlRechercheSalariesMessagerie } from "../controllers/control.messages.js";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";

const router = express.Router();
router.use("/messagerie", verifierAuthentification);
router.get("/messagerie/salaries", controlRechercheSalariesMessagerie);
router.get("/messagerie/utilisateurs/:id/avatar", controlAvatarMessagerie);
router.get("/messagerie/conversations", controlListeConversations);
router.post("/messagerie/conversations", controlCreerConversation);
router.get("/messagerie/conversations/:id/messages", controlListeMessages);
router.post("/messagerie/conversations/:id/messages", controlEnvoiMessage);
router.get("/messagerie/canaux/:id/messages", controlListeMessagesCanal);
router.post("/messagerie/canaux/:id/messages", controlEnvoiMessageCanal);
export default router;
