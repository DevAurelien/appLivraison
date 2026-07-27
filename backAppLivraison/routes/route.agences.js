import express from "express";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
import { controlCreaAgences } from "../controllers/control.agences.js";
const router = express.Router();

router.post("/creation/agences", verifierAuthentification, controlCreaAgences);

export default router;
