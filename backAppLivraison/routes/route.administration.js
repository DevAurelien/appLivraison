import express from "express";
import {
  controlListeRolesAdministration,
  controlModificationRoleUtilisateur,
  controlRechercheUtilisateursAdministration,
  controlIndicateursAdministration,
  controlChiffreAffairesAgences,
} from "../controllers/control.administration.js";
import { autoriserPermissionOuRoles, autoriserUneDesPermissions, verifierAuthentification } from "../middlewares/middlewares.auth.js";

const router = express.Router();
const rolesRhDirection = ["RESPONSABLE_RH", "PDG", "GM"];

router.get(
  "/administration/tableau-de-bord",
  verifierAuthentification,
  controlIndicateursAdministration,
);

router.get(
  "/administration/statistiques/chiffre-affaires",
  verifierAuthentification,
  autoriserUneDesPermissions("COMPTABILITE_LIRE", "FACTURES_LIRE", "LIVRAISONS_LIRE_TOUTES", "POINTAGES_LIRE_TOUS"),
  controlChiffreAffairesAgences,
);

router.get(
  "/administration/gestion/utilisateurs",
  verifierAuthentification,
  autoriserPermissionOuRoles("UTILISATEURS_LIRE", ...rolesRhDirection),
  controlRechercheUtilisateursAdministration,
);
router.get(
  "/administration/gestion/roles",
  verifierAuthentification,
  autoriserPermissionOuRoles("ROLES_LIRE", ...rolesRhDirection),
  controlListeRolesAdministration,
);
router.put(
  "/administration/gestion/utilisateurs/:id/role",
  verifierAuthentification,
  autoriserPermissionOuRoles("UTILISATEURS_MODIFIER_ROLE", ...rolesRhDirection),
  controlModificationRoleUtilisateur,
);

export default router;
