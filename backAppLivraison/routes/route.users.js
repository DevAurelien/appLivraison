import express from "express";
import {ControlLoginUsers, ControlRegisterUsers, ControlRefreshUsers, controlImageProfil, ControlLogoutUsers, 
   controlAfficherAvatar, ControlAssignerPointages, ControlRecupPointages, ControlAssignPointed } from "../controllers/control.users.js"
import multer from "multer";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";
import { sql } from "../database/db.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    await sql.query("SELECT 1");
    return res.sendStatus(204);
  } catch {
    return res.sendStatus(503);
  }
});

router.post("/auth/register", ControlRegisterUsers);
router.post("/auth/login", ControlLoginUsers);
router.post("/auth/refresh", ControlRefreshUsers);
router.post("/auth/logout", ControlLogoutUsers);
router.post("/pointages/assigner/:id",verifierAuthentification , ControlAssignerPointages);
router.get("/pointages/recup/:id",verifierAuthentification , ControlRecupPointages);

router.post("/pointed/assign", verifierAuthentification, ControlAssignPointed);

const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router.post(
  "/api/avatar/upload",
  uploadAvatar.single("avatar"),
  controlImageProfil,
);

router.get(
  "/users/avatar",
  verifierAuthentification,
  controlAfficherAvatar,
);

export default router;
