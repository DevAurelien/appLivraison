import express from "express";
import {ControlLoginUsers, ControlRegisterUsers, ControlRefreshUsers, controlImageProfil, controlAfficherAvatar, verifierAuthentification } from "../controllers/control.users.js"

const router = express.Router();

// router.get("/users", controlUsers)

// router.post("/users", ControlPostUsers);
router.post("/auth/register", ControlRegisterUsers);
router.post("/auth/login", ControlLoginUsers);

router.post("/auth/refresh", ControlRefreshUsers);
import multer from "multer";

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
  "/api/users/avatar",
  verifierAuthentification,
  controlAfficherAvatar,
);


// router.get("/users", ControlGetUsers)

export default router;
// GET    /users
// GET    /users/:id
// POST   /users
// PATCH  /users/:id
// DELETE /users/:id