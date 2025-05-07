import { Router } from "express";
import { authentication, adminAuthorization } from "../middlewares/auth.mdw.js";
import customerController from "../controllers/customerController.js";

const customerRoute = Router();

customerRoute.get("/", customerController.getAllCustomers);
customerRoute.get(
    "/:customerId",
    authentication,
    adminAuthorization,
    customerController.getCustomerById
);
customerRoute.get("/:customerId/orders", customerController.getOrderByCustomer);
customerRoute.post("/", customerController.createCustomer);

export default customerRoute;