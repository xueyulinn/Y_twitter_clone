import express, { urlencoded } from "express";
import AuthRoute from "./routes/authRoute.js";
import DatabaseConnection from "./db/mongoDB_connec.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// load .env file into process.dev 
dotenv.config();
const app = express();
// we need middleware to parse requests
app.use(express.json());

app.use(cookieParser());

app.use(urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    DatabaseConnection;
});

app.use("/api/auth", AuthRoute);

