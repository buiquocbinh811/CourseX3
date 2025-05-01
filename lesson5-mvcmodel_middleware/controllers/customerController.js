import CustomerModel from "../models/customer.js"
import OrderModel from "../models/order.js"
import ProductModel from "../models/product.js"
import mongoose from "mongoose"
const { ObjectId } = mongoose.Types; 
// mongoose.connect('mongodb://localhost:27017/shop', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
const customerController = {
    getAllCustomers: async (req, res, next) => {
        // Kiểm tra quyền của tài khoản
        // Xác thực và chuẩn hóa dữ liệu đầu vào
        // Service
        try {
            const result = await CustomerModel.find({});
            res.json({ message: "ok", data: result });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }

    },
    getCustomerById: async (req, res, next) => {
        // Kiểm tra quyền của tài khoản
        // Xác thực dữ liệu đầu vào 
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }
            const customers = await CustomerModel.findById(req.params.customerId);
            res.json({ message: "ok", data: customers });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }

    },
    //bai3
    getOrderByCustomer: async (req, res, next) => {
        try {
            // 1. Validate customerId
            if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
                return res.status(400).json({ message: "Invalid customer ID format" });
            }

            // 2. Tìm orders (không cần chuyển ObjectId nữa)
            const orders = await OrderModel.find({ 
                customerId: req.params.customerId
            }).populate('productId', 'name price');

            // 3. Trả về kết quả
            return res.json({
                message: orders.length ? "Orders retrieved successfully" : "No orders found for this customer",
                data: orders
            });

        } catch (error) {
            console.error("Error in getOrderByCustomer:", error);
            res.status(500).json({ 
                message: "Server error",
                error: error.message 
            });
        }
    }
}

export default customerController