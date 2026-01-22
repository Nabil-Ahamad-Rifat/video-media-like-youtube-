import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"




cloudinary.config({ 
  cloud_name:process.env.CLUDEINARY_CLUDE_NAME, 
  api_key: process.env.CLUDEINARY_CLUDE_API_KEY, 
  api_secret: process.env.CLUDEINARY_CLUDE_API_SECRET,
});

const uploadOnCludeinary = async (localfilepath)=>{
    try {
        if(!localfilepath)return null;
        const responce = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto",
        })
        //file has been upload successfully 
        console.log("file uploaded on cloudeinary successfully",responce.url);
        // console.log(responce);
        fs.unlinkSync(localfilepath);
        return responce;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        console.log("cloudinary upload error :",error);
        return null;
        
    }
}

export {uploadOnCludeinary};
// export {uploadOnCludeinary};



