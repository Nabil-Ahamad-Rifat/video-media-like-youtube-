import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json({limit:"1mb"}));
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));

app.use(express.urlencoded({extended:true, limit:"1mb"}));

app.use(cookieParser());









export default app;