import { Router } from "express";
import customerController from "../controllers/customerController.js"
const customerRoute = Router();

customerRoute.get("/", customerController.getAllCustomers);
customerRoute.get("/:customerId",customerController.getCustomerById );
customerRoute.get("/:customerId/orders", customerController.getOrderByCustomer);

export default customerRoute;  