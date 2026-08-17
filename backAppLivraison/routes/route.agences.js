import express from "express";
import { autoriserPermissions, verifierAuthentification } from "../middlewares/middlewares.auth.js";
import {
  controlCreaAgences,
  controlModificationAgence,
  controlRecupAgences,
  controlSuppressionAgence,
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


export default router;
