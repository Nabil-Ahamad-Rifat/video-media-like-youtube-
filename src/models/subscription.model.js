import mongoose, { Schema } from "mongoose";

const subscriptionSchema  = new mongoose.Schema({

    subscriber:{
        type:Schema.type.objectId,
        ref :"user"
    },
    chanal:{
        type:Schema.type.objectId,
        ref:"user"
    }

}) 



export const Subscription = mongoose.model("Subscription",subscriptionSchema);
export default Subscription;