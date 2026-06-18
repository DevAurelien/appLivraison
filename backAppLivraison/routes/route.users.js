import express from "express";
import {ControlPostUsers, ControlGetUsers} from "../controllers/control.users.js"

const router = express.Router();

// router.get("/users", controlUsers)

router.post("/users", ControlPostUsers);

router.get("/users", ControlGetUsers)

export default router;
// GET    /users
// GET    /users/:id
// POST   /users
// PATCH  /users/:id
// DELETE /users/:id