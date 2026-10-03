import express from "express"; 
import cors from "cors";
import 'dotenv/config';
import http from "http";
import {connectDB} from './config/db.js'

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

app.get("/", (req, res) => {

    res.send("API WORKING ")
})

// third step 
const server = http.createServer(app);

server.listen(PORT , () => {
    console.log("Server started ")
})