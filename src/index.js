import "dotenv/config";
// import express from "express";
import connectionDB from "./db/dbconnection.js";
import app from "./app.js"


const port = process.env.PORT 
connectionDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is runing on port ${port}`);
    })

})
.catch((error)=>{
    console.log("Db connection error :",error);
});
