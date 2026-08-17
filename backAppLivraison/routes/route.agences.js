import express from "express";
import { autoriserPermissions, autoriserUneDesPermissions, verifierAuthentification } from "../middlewares/middlewares.auth.js";
import {
  controlCreaAgences,
  controlModificationAgence,
  controlRecupAgences,
  controlSuppressionAgence,
  controlAffectationCamionTournee,
  controlOrganisationTourneesAgence,
} from "../controllers/control.agences.js";
const router = express.Router();

router.post(
  "/creation/agences",
  verifierAuthentification,
  autoriserPermissions("AGENCES_CREER"),
  controlCreaAgences
);

router.get(
  "/administration/agences/recuperation",
  verifierAuthentification,
  autoriserPermissions("AGENCES_LIRE"),
  controlRecupAgences
);

router.patch(
  "/administration/agences/modification/:id",
  verifierAuthentification,
  autoriserPermissions("AGENCES_MODIFIER"),
  controlModificationAgence,
);

router.delete(
  "/administration/agences/suppression/:id",
  verifierAuthentification,
  autoriserPermissions("AGENCES_SUPPRIMER"),
  controlSuppressionAgence,
);

router.get(
  "/administration/agences/:id/tournees",
  verifierAuthentification,
  autoriserUneDesPermissions("PLANNING_LIRE", "PLANNING_MODIFIER", "CAMIONS_MODIFIER"),
  controlOrganisationTourneesAgence,
);
router.put(
  "/administration/agences/:id/tournees/:tourneeId/camion",
  verifierAuthentification,
  autoriserUneDesPermissions("PLANNING_MODIFIER", "CAMIONS_MODIFIER"),
  controlAffectationCamionTournee,
);


export default router;
