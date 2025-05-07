import { Router } from "express";
import orderController from "../controllers/orderController.js"
const orderRoute = Router();

orderRoute.get("/highvalue", orderController.getHighValue);
orderRoute.post("/", orderController.createOrder);
orderRoute.put("/:orderId", orderController.updateQuantityOrder);

export default orderRoute;