import express from 'express'
import {verifierAuthentification} from "../middlewares/middlewares.auth.js"
import {controlGestionSalaries, controlCamion} from "../controllers/control.gestion.js" 

const router = express.Router();

router.post("/gestion/salaries", verifierAuthentification,controlGestionSalaries);

router.post("/creaCamion", verifierAuthentification, controlCamion)

export default router;