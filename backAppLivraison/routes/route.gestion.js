import express from "express";
import { autoriserPermissions, verifierAuthentification } from "../middlewares/middlewares.auth.js";
import {
  controlCamion,
  controlAffectationCamionAgence,
  controlGestionSalaries,
  controlModificationCamion,
  controlRecuperationCamions,
  controlSuppressionCamion,
} from "../controllers/control.gestion.js";

const router = express.Router();

router.post("/gestion/salaries", verifierAuthentification, controlGestionSalaries);
router.post("/creaCamion", verifierAuthentification, autoriserPermissions("CAMIONS_CREER"), controlCamion);
router.get("/administration/camions/recuperation", verifierAuthentification, autoriserPermissions("CAMIONS_LIRE"), controlRecuperationCamions);
router.patch("/administration/camions/modification/:id", verifierAuthentification, autoriserPermissions("CAMIONS_MODIFIER"), controlModificationCamion);
router.delete("/administration/camions/suppression/:id", verifierAuthentification, autoriserPermissions("CAMIONS_SUPPRIMER"), controlSuppressionCamion);
router.put("/administration/camions/:id/agence", verifierAuthentification, autoriserPermissions("CAMIONS_MODIFIER"), controlAffectationCamionAgence);

export default router;
