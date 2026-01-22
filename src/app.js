import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(cookieParser());


//routes  import 
import useRouter from "./routes/user.routes.js";



// router 
app.use("/api/v1/ueser",useRouter)


export default app;
