import express from "express";
import { controlCiblesDiffusion, controlMessagesAccueil, controlPublierMessageDiffusion, controlRechercheCiblesDiffusion } from "../controllers/control.messagesDiffusion.js";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
const router = express.Router();
router.get("/accueil/messages", verifierAuthentification, controlMessagesAccueil);
router.get("/accueil/messages/cibles", verifierAuthentification, controlCiblesDiffusion);
router.get("/accueil/messages/utilisateurs", verifierAuthentification, controlRechercheCiblesDiffusion);
router.post("/accueil/messages", verifierAuthentification, controlPublierMessageDiffusion);
export default router;
