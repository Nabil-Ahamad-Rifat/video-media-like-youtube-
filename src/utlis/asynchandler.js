const asyncHandler =(requestHeldeler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHeldeler(req,res,next)).catch((error)=>{next((error))});
    }

}





/*
 const asynchandeler = (requestHandeler)=> async(req,res,next)=>{
    try {
        await requestHandeler(req,res,next)
    } catch (error) {
        res.status(error.code||500).json({sucess:"false",message:error.message});
        
    }
 }
*/

export  default asyncHandler;