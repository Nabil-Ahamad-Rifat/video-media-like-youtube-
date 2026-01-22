import { Router } from "express";
import { registration } from "../controllers/user.controler.js";
import { upload } from "../middleware/multer.middleware.js";



const router = Router();

router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]), registration)




export default router;