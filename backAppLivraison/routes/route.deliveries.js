import express from "express";
import {controlRecupDeliveries} from "../controllers/control.deliveries.js"

const router = express.Router();

router.get("/livraisonsJour", controlRecupDeliveries)

router.get("/deliveries/:id", controlRecupDeliveries)

// router.get("/livraisonsJour", controlRecupLivraisons)

// router.post("/deliveries", controlDeliveries)

export default router;


// GET    /deliveries
// GET    /deliveries/:id
// POST   /deliveries
// PATCH  /deliveries/:id
// DELETE /deliveries/:id