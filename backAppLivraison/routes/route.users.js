import express from "express";
import {ControlLoginUsers, ControlRegisterUsers} from "../controllers/control.users.js"

const router = express.Router();

// router.get("/users", controlUsers)

// router.post("/users", ControlPostUsers);
router.post("/auth/register", ControlRegisterUsers);
router.post("/auth/login", ControlLoginUsers)

// router.get("/users", ControlGetUsers)

export default router;
// GET    /users
// GET    /users/:id
// POST   /users
// PATCH  /users/:id
// DELETE /users/:id