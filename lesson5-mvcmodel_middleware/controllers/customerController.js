import customer from "../models/customer.js"
import order from "../models/order.js"
import mongoose from "mongoose"
const customerController = {
    getAllCustomers: async (req, res, next) => {
        // Kiểm tra quyền của tài khoản
        // Xác thực và chuẩn hóa dữ liệu đầu vào
        // Service
        try {
            const result = await customer.find({});
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
            const customers = await customer.findById(req.params.customerId);
            res.json({ message: "ok", data: customers });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }

    },
    getOrderByCustomer: async (req, res, next) => {
        try {
            // Kiểm tra customerId hợp lệ
            if (!mongoose.Types.ObjectId.isValid(req.params.customerId)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }

            // Chuyển customerId thành ObjectId nếu cần
            const customerId = mongoose.Types.ObjectId(req.params.customerId);

            const result = await order.find({
                customerId: customerId // So sánh ObjectId với ObjectId
            }).exec();

            return res.json({ message: "ok", data: result });
        } catch (error) {
            console.error(error); // Log lỗi để debug
            res.status(500).json({ message: "Server error" });
        }
}
}

export default customerController