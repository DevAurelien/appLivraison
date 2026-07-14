import express from "express";
import {
  controlRecupSalaries,
  controlAfficherAvatarSalarie,
} from "../controllers/control.salaries.js";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
import {autoriserRoles} from "../middlewares/middlewares.auto.js"

const router = express.Router();

router.get("/salariesSearch", verifierAuthentification, autoriserRoles("Livreur"), controlRecupSalaries);
router.get(
  "/salaries/:id/avatar",
  verifierAuthentification,
  autoriserRoles("Livreur"),
  controlAfficherAvatarSalarie,
);

export default router;
