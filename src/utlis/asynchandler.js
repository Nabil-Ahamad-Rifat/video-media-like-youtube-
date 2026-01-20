const asyncHandler =(requestHeldeler)=>{
    (req,res,next)=>{
        promise.resolve(requestHeldeler(req,res,next)).catch(next).catch((error)=>{next((error))});
    }

}