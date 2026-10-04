import express from 'express'
import { verifierAuthentification } from '../middlewares/middlewares.auth.js';
import { controlCreaClients } from '../controllers/control.clients.js';
const router = express.Router();

router.post("/clients/creation", verifierAuthentification, controlCreaClients)

export default router;