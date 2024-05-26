import express from "express";
import AuthRoute from "./routes/authRoute.js";

const app = express();

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

app.use("/api", AuthRoute);

