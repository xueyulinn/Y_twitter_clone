import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = mongoose.connect(process.env.MongoDB_URI ).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
});

export default dbConnection;