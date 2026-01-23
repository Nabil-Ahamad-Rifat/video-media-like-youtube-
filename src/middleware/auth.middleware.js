import  Jwt  from "jsonwebtoken";
import { ApiError } from "../utlis/apierror.js";
import asyncHandler from "../utlis/asynchandler.js";
import { User } from "../models/user.model.js";

export const  verrifyjwt = asyncHandler( async(req,res,next)=>{
try {
        const token= req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized request");
        }
        const decodeToken = Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodeToken._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401,"invalid access token");
    
        }
        req.user =user;
        next();
} catch (error) {
    throw new ApiError(401,error.message||"middleware invalid access token");
}
})