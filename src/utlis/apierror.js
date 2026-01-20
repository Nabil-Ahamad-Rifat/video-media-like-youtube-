class ApiError extends Error{
    constructor(
        statuscode,
        message,
        errors=[],
        stack=""
    ){
        supper(message);
        this.statuscode=statuscode;
        this.message=message;
        this.errors=errors;
        if(stack){
            this.stack=stack;
        } else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}