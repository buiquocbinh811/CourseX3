import { Router } from "express";
import orderController from "../controllers/orderController.js"
const orderRoute = Router();

orderRoute.get("/highvalue", orderController.getHighValue);

export default orderRoute;