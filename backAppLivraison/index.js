import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
  override: true,
});

import routeDeliveries from "./routes/route.deliveries.js"
import routeUsers from "./routes/route.users.js"
import routeSalaries from "./routes/route.salaries.js"

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser())
app.use(express.json())
app.use("/", routeDeliveries );
app.use("/", routeUsers);
app.use("/", routeSalaries)


if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3001, () => {
    console.log("API lancée");
  });
}


export default app;