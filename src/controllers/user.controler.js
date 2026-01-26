import { response } from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utlis/apierror.js";
import asyncHandler from "../utlis/asynchandler.js";
import { uploadOnCludeinary } from "../utlis/cloudinary.js";
import { ApiResponce } from "../utlis/apiresponce.js";
import  jwt  from 'jsonwebtoken';

//generate access and refresh token 
const generateAccessAndRrfreshTokens = async(userid)=>{
    const user= await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {accessToken, refreshToken};
}




const registration = asyncHandler(async (req, res) => {
    //get user details from fontend 
    // validation - not empty files 
    //check user is already exist 
    //check img , avter 
    //upload them to cloudinary avtar 
    // cdrate user object -crate entry in db 
    //remove password refesh token filid from response 
    const { fullname, email, username, password } = req.body;
    console.log(fullname, email, username, password);
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all filed are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "user alrady exist with this email or username");
    }
    console.log("req file ",req)

    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverLmageLocalPath = req.files?.coverImage[0]?.path;

    console.log("avatar local path", avatarlocalpath);
    console.log("cover image local path", coverLmageLocalPath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "avatar is required ");
    }

    const avatar = await uploadOnCludeinary(avatarlocalpath);
    const coverImage = await uploadOnCludeinary(coverLmageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "unable to upload avatar please try again later ");
    }

    const user = await User.create({
        fullname,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password
    })

    if (!user) {
        throw new ApiError(500, "unable to create user please try again later ");
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "unable to create user please try again later ");
    }

    return res.status(201).json(
        new ApiResponce(201, createdUser, "user created successfully")
    )
});



const loginUser = asyncHandler(async(req,res)=>{
    const {email, username, password}= req.body;
    if(!email && !username){
        throw new ApiError(400,"email or username is missing ");
    }
    const user = await User.findOne({$or:[{email},{username}]})
    if(!user){
        throw new ApiError(404,"user not found with this email or username ");
    }
    const ismatchedPassword = await user.ispasswordCorrect(password);
    if(!ismatchedPassword){
        throw new ApiError(401,"invalid password");
    }

    const tokens = await generateAccessAndRrfreshTokens(user._id);
    const {accessToken,refreshToken}=tokens;

     const logedInUser = await User.findById(user._id).select("-password -refreshToken");
     const options = {
        httpOnly:true,
        secure: true,
     }


     return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponce(200,
            {
                user:logedInUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
     )
})

export const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const option = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponce(200,{},"user loged Out"))

}) 

export const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookie.refreshToken|| req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized reqest");
    }try {
        
        const decodeToken = jwt.verify(incomingRefreshToken,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodeToken._id);
        if(incomingRefreshToken !==user?.refreshAccessToken){
            throw new ApiError(401,"invalid refresh token ");
        }
        const {accessToken,newrefreshToken} = generateAccessAndRrfreshTokens(user._id);
        options ={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",newrefreshToken,option)
        .json( new ApiResponce(200,{accessToken,"refreshToken":newrefreshToken},"access token refresh"));
    } catch (error) {
        throw new ApiError(401, error?.message ||"invalid refresh Token" );
    }

})

export const changePassword = asyncHandler(async(req,res)=>{
    const {oldpassword, newpassord}= req.body;
    if(!oldpassword ||!newpassord){
        throw new ApiError(400,"old password and new assword is required");
    }
    const user = await User.findById(req.user._id);
    if(!user){
        throw  new ApiError(400,"user not dound");
    }
    const ismatchedoldpassword = await user.ispasswordCorrect(oldpassword);
    if(!ismatchedoldpassword){
        throw new ApiError(401,"invalid old password")
    }
    user.password = newpassord;
    await User.save({validateBeforeSave:false});
    return res.status(200)
    .json(new ApiResponce(200,{},"password chnaged successfully"));
})
// get current user
export const getcurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponce(200,req.user,"current User factch successfully"));
})
export const updateAccountDrtails = asyncHandler(async(req,res)=>{
    const {email,fullname}=req.body;
    if(!email ||!fullname){
        throw new ApiError(400,"data not find");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                email:email,
                fullname:fullname
            }
        }
    ).select("-password");
    return res.status(200)
    .json(new ApiResponce(200,user,"user details updated successfully"));
})
// update avatar
export const updateavatar = asyncHandler(async(req,res)=>{
    const avatarlocalpath = req.file?.path;
    if(!avatarlocalpath){
        throw new ApiError(400,"avatar file is missing");
    }
    const avatar = await uploadOnCludeinary(avatarlocalpath);
    if(!avatar){
        throw new ApiError(500,"unable to upload avatar please try again later");
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar:avatar.url
            }
        }
    ).select("-password");
    return res.status(200)
    .json(new ApiResponce(200,user,"user avater updated successfully"));
})
// update cover image
export const updateCoverImage = asyncHandler(async(req,res)=>{
    const CoverImagelocalpath = req.file?.path;
    if(!CoverImagelocalpath){
        throw new ApiError(400,"cover image file is missing");
    }
    const CoverImage = await uploadOnCludeinary(CoverImagelocalpath);
    if(!CoverImage){
        throw new ApiError(500,"unable to upload cover image please try again later");
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                CoverImage:CoverImage.url
            }
        }
    ).select("-password");
    return res.status(200)
    .json(new ApiResponce(200,user,"user avater updated successfully"));
})


export { registration };
export {loginUser }



