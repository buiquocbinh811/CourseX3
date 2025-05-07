import express from "express";
import mongoose from "mongoose";
import customerRoute from "./src/routes/customerRouter.js";
import orderRoute from "./src/routes/ordersRouter.js";
import productRoute from "./src/routes/productRouter.js"; // Thêm dòng này
import loggerInfo from "./src/middlewares/loggerInfo.js";
import authRouter from "./src/routes/authRouter.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(loggerInfo);
app.use(express.json());

// Middleware to log request details
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);
app.use("/products", productRoute);
app.use("/auth", authRouter);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
