import express from "express";
import {
  controlRecupSalaries,
  controlAfficherAvatarSalarie,
} from "../controllers/control.salaries.js";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";

const router = express.Router();

router.get("/salariesSearch", verifierAuthentification, controlRecupSalaries);
router.get(
  "/salaries/:id/avatar",
  verifierAuthentification,
  controlAfficherAvatarSalarie,
);

export default router;
