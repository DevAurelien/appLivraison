import express from "express";
import {ControlLoginUsers, ControlRegisterUsers, ControlRefreshUsers, controlImageProfil, controlAfficherAvatar } from "../controllers/control.users.js"
import multer from "multer";
import { verifierAuthentification } from "../middlewares/middlewares.auth.js";

const router = express.Router();

router.post("/auth/register", ControlRegisterUsers);
router.post("/auth/login", ControlLoginUsers);
router.post("/auth/refresh", ControlRefreshUsers);

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
