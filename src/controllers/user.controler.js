import asyncHandler from "../utlis/asynchandler.js";

const registration = asyncHandler(async(req,res)=>{
    res.status(200).json({ message:"user register handeler  "})
})





 export {registration};






 