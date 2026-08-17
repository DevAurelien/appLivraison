import express from "express";
import {
  controlRecupSalaries,
  controlAfficherAvatarSalarie,
  controlAffectationEquipage,
  controlAffiliationLivreurAgence,
  controlOrganisationAgence,
  controlRechercheLivreurs,
  controlTousSalaries,
} from "../controllers/control.salaries.js";
import { autoriserPermissions, autoriserUneDesPermissions, verifierAuthentification } from "../middlewares/middlewares.auth.js";
import {autoriserRoles} from "../middlewares/middlewares.auto.js"

const router = express.Router();

router.get("/salariesSearch", verifierAuthentification, autoriserRoles("Livreur"), controlRecupSalaries);
router.get(
  "/salaries/:id/avatar",
  verifierAuthentification,
  autoriserRoles("Livreur"),
  controlAfficherAvatarSalarie,
);

router.get(
  "/administration/livreurs/recherche",
  verifierAuthentification,
  autoriserPermissions("AGENCES_AFFECTER_SALARIE"),
  controlRechercheLivreurs,
);
router.put(
  "/administration/livreurs/affiliation",
  verifierAuthentification,
  autoriserPermissions("AGENCES_AFFECTER_SALARIE"),
  controlAffiliationLivreurAgence,
);
router.get(
  "/administration/livreurs/tous",
  verifierAuthentification,
  autoriserUneDesPermissions("UTILISATEURS_LIRE", "AGENCES_AFFECTER_SALARIE", "POINTAGES_LIRE_AGENCE", "CAMIONS_AFFECTER_EQUIPAGE"),
  controlTousSalaries,
);
router.get(
  "/administration/livreurs/organisation",
  verifierAuthentification,
  autoriserUneDesPermissions("CAMIONS_AFFECTER_EQUIPAGE", "AGENCES_AFFECTER_SALARIE", "POINTAGES_LIRE_AGENCE"),
  controlOrganisationAgence,
);
router.put(
  "/administration/livreurs/camions/:camionId/equipage",
  verifierAuthentification,
  autoriserPermissions("CAMIONS_AFFECTER_EQUIPAGE"),
  controlAffectationEquipage,
);

export default router;
