import mongoose from "mongoose";
import { Trim } from './../../node_modules/mongoose/types/expressions.d';

const userSchema = new mongoose.Schema({
     username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        Trim:true,
        index:true
     },
     email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        Trim:true,
     },
     fullname: {
        type:String,
        required:true,
        Trim:true,
        index:true
     },
     avatar: {
        type:String, // cloudinary url 
        required:true,
     },
     coverImage:{
        type:String,
     },
     watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video",
     }],
     password:{
        type:String,
        required:[true,"password is required"],

     },
     reffreshToken:{
        type:String,
     }
},{
    timestamps:true,
})

userSchema.pre("save",async function(next){
    if(!this.ismodified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.ispasswordCorrect = async function (password) {
    await bcrypt.compare(password,this.password);
}
userSchema.methods.generateRefreshtoken = function(){
    return jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },process.env.ACCESS_TOKEN_SECRET,{expireIn:process.env.ACCESS_TOKEN_EXPIRE});
}

userSchema.methods.generateRefreshtoken = function(){
    return jwt.sign({
        id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{expireIn:process.env.REFRESH_TOKEN_EXPIRE})
}



export const User = mongoose.model("User",userSchema);