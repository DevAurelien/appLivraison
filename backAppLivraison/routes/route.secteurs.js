import express from "express";
import {
  autoriserPermissions,
  verifierAuthentification,
} from "../middlewares/middlewares.auth.js";
import {
  controlCreationSecteurs,
  controlModificationSecteur,
  controlRecupSecteurs,
  controlSuppressionSecteur,
} from "../controllers/control.secteurs.js";

const router = express.Router();

router.post(
  "/administration/secteurs/creation",
  verifierAuthentification,
  autoriserPermissions("SECTEURS_CREER"),
  controlCreationSecteurs
);

router.get(
  "/administration/secteurs/recuperation",
  verifierAuthentification,
  autoriserPermissions("SECTEURS_LIRE"),
  controlRecupSecteurs
);

router.patch(
  "/administration/secteurs/modification/:id",
  verifierAuthentification,
  autoriserPermissions("SECTEURS_MODIFIER"),
  controlModificationSecteur
);

router.delete(
  "/administration/secteurs/suppression/:id",
  verifierAuthentification,
  autoriserPermissions("SECTEURS_SUPPRIMER"),
  controlSuppressionSecteur
);

export default router;
