import { Router } from "express";
import { registration } from "../controllers/user.controler.js";




const router = Router();

router.route("/register").post(registration)




export default router;