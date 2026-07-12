import express from "express"
import {controlSalaries} from "../controllers/control.salaries.js"

const router = express.Router()

router.get("/salariesSearch", controlSalaries);

export default router;