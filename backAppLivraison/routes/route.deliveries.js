import express from "express";
import { controlAjouterPhotoLivraison, controlDeclarerIncidentLivraison, controlFinaliserLivraison, controlModifierArticleLivraison, controlRecupDeliveries } from "../controllers/control.deliveries.js"
import {verifierAuthentification} from "../middlewares/middlewares.auth.js"
import multer from "multer";

const router = express.Router();

router.get("/livraisonsJour", verifierAuthentification, controlRecupDeliveries)
router.patch("/livraisons/:id/articles/:operationId", verifierAuthentification, controlModifierArticleLivraison);
router.post("/livraisons/:id/finaliser", verifierAuthentification, controlFinaliserLivraison);
router.post("/livraisons/:id/incidents", verifierAuthentification, controlDeclarerIncidentLivraison);
const uploadPhoto = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
router.post("/livraisons/:id/photos", verifierAuthentification, uploadPhoto.single("photo"), controlAjouterPhotoLivraison);

// router.get("/livraisonsJour", controlRecupLivraisons)

// router.post("/deliveries", controlDeliveries)

export default router;


// GET    /deliveries
// GET    /deliveries/:id
// POST   /deliveries
// PATCH  /deliveries/:id
// DELETE /deliveries/:id
