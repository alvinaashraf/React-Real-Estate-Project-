import express from "express"; 
import cors from "cors";
import 'dotenv/config';
import http from "http";
import {connectDB} from './config/db.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import wishListRouter from "./routes/wishlist.routes.js";
import contactRouter from "./routes/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";

// first step 
const app = express();
const PORT = 5000;


//DB 
connectDB()

//Middleware 
// second step 
app.use(cors());
app.use(express.json());

//Route 
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/property", propertyRouter)
app.use("/api/inquiry", inquiryRouter)
app.use("/api/wishlist", wishListRouter )
app.use("/api/contact", contactRouter)
app.use("/api.admin", adminRouter)

app.get("/", (req, res) => {

    res.send("API WORKING ")
})

// third step 
const server = http.createServer(app);

server.listen(PORT , () => {
    console.log("Server started ")
})