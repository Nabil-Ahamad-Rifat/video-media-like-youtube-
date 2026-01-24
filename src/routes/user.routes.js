import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registration } from "../controllers/user.controler.js";
import { upload } from "../middleware/multer.middleware.js";
import { verrifyjwt } from "../middleware/auth.middleware.js";



const router = Router();

router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]), registration)

router.route("/login").post(loginUser)
// secqure router 
router.route("/logout").post(verrifyjwt,logoutUser)
router.route("/refredh-token".post(refreshAccessToken))

export default router;