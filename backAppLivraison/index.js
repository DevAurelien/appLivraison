import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import routeDeliveries from "./routes/route.deliveries.js"
import routeUsers from "./routes/route.users.js"


const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(cookieParser())
app.use(express.json())
app.use("/", routeDeliveries );
app.use("/", routeUsers);


app.listen(PORT,()=> console.log(`Serveur sur le ${PORT}`))
