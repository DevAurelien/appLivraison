import express from 'express';
import { obtenirCatalogueProduits } from '../controllers/control.produits.js';
import { verifierAuthentification } from '../middlewares/middlewares.auth.js';

const router = express.Router();

router.get('/catalogue', verifierAuthentification ,obtenirCatalogueProduits);

export default router;
