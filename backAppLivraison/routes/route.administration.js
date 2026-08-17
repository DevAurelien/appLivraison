import express from "express";
import {
  controlListeRolesAdministration,
  controlModificationRoleUtilisateur,
  controlRechercheUtilisateursAdministration,
} from "../controllers/control.administration.js";
import { autoriserPermissionOuRoles, verifierAuthentification } from "../middlewares/middlewares.auth.js";

const router = express.Router();
const rolesRhDirection = ["RESPONSABLE_RH", "PDG", "GM"];

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
