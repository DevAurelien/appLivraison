import express from "express";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
import { controlCreaAgences, controlRecupAgences } from "../controllers/control.agences.js";
const router = express.Router();

router.post(
  "/creation/agences",
  verifierAuthentification,
  controlCreaAgences
);

router.get(
  "/administration/agences/recuperation",
  verifierAuthentification,
  controlRecupAgences
);


export default router;
