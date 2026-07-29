import express from 'express'
import {verifierAuthentification} from "../middlewares/middlewares.auth.js"
import {controlGestionSalaries} from "../controllers/control.gestion.js" 

const router = express.Router();

router.post("/gestion/salaries", verifierAuthentification,controlGestionSalaries);

export default router;