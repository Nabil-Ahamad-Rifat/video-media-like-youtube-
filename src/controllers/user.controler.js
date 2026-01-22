import { response } from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utlis/apierror.js";
import asyncHandler from "../utlis/asynchandler.js";
import { uploadOnCludeinary } from "../utlis/cloudinary.js";
import { ApiResponce } from "../utlis/apiresponce.js";

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

export { registration };






