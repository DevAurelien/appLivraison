import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import routeDeliveries from "./routes/route.deliveries.js"
import routeUsers from "./routes/route.users.js"
import routeSalaries from "./routes/route.salaries.js"
import routeAgences from "./routes/route.agences.js"
import routeSecteurs from "./routes/route.secteurs.js"
import dotenv from "dotenv";
import routerGestion from "./routes/route.gestion.js"
import routeAdministration from "./routes/route.administration.js"
import { interdireRoles, verifierAuthentification } from "./middlewares/middlewares.auth.js"

dotenv.config({
  path: ".env.local",
  override: true,
  quiet: true,
});

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser())
app.use(express.json())
app.use("/administration", verifierAuthentification, interdireRoles("CLIENT", "MAGASIN"));
app.use("/", routeDeliveries );
app.use("/", routeUsers);
app.use("/", routeSalaries);
app.use("/", routeAgences);
app.use("/", routerGestion);
app.use("/", routeSecteurs)
app.use("/", routeAdministration)


if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3001, () => {
    console.log("API lancée");
  });
}

export default app;
