import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()

const connectToDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_ATLAS_URL)
        
        console.log(`Connected with DB: ${connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectToDB