import express from "express";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
import { controlCreationSecteurs } from "../controllers/control.secteurs.js";

const router = express.Router();

router.post(
  "/administration/secteurs/creation",
  verifierAuthentification,
  controlCreationSecteurs
);

export default router;