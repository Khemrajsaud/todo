import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected mongodb data");
        
        
    } catch (error) {
        
        console.log('error connecting to the database' , error);
        
    }
}
export default connectDB;