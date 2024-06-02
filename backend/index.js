import express, { urlencoded } from "express";
import AuthRoute from "./routes/authRoute.js";
import UserRoute from "./routes/userRoute.js";
import PostRoute from "./routes/postRoute.js";
import NotificationRoute from "./routes/notificationRoute.js";

import DatabaseConnection from "./db/mongoDB_connec.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';


// load .env file into process.dev 
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const app = express();

// we need middleware to parse requests
app.use(express.json(
  { limit: "2mb" }
));

app.use(cookieParser());

app.use(urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  DatabaseConnection;
});

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/notification", NotificationRoute);

