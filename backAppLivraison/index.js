import express from "express"
import cors from "cors"
import routeDeliveries from "./routes/route.deliveries.js"

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use("/", routeDeliveries );


app.listen(PORT,()=> console.log(`Serveur demarré sur le ${PORT}`))
