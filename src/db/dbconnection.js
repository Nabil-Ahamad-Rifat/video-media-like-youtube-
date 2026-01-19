import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectionDB = async () => {
    try {
        const dburl = process.env.MONGO_URL;

        if (!dburl) {
            console.error("ERROR: MONGO_URL is not defined in your .env file.");
            process.exit(1);
        }

        const connectionInstance = await mongoose.connect(`${dburl}/${DB_NAME}`);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection failed: ", error);
        process.exit(1);
    }
}

export default connectionDB;