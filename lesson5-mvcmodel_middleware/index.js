import express from "express"
import mongoose from "mongoose";
import customerRoute from "./routes/customerRoutes.js";
import loggerInfo from "./middlewares/loggerInfo.js";

const app = express();

app.use(loggerInfo)
app.use(express.json())

// Middleware to log request details
app.use('/customers', customerRoute);
mongoose.connect("mongodb://localhost:27017/shop")
.then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});