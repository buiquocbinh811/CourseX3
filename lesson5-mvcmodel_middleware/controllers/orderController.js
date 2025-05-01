import mongoose from "mongoose";
import orderRoute from "../routes/ordersRouter.js";
import OrderModel from "../models/order.js";
     // bài 4. Lấy thông tin các đơn hàng với tổng giá trị trên 1000$
    // Viết API để lấy danh sách các đơn hàng có 
    // tổng giá trị (totalPrice) trên 1000$
    // Endpoint: GET /orders/highvalue
    // Yêu cầu: Trả về danh sách các đơn hàng có 
    // totalPrice lớn hơn 1000$
    //toán tử của MongoDB
// $gte : greater than or equal (≥)
// $lt : less than (<)
// $lte : less than or equal (≤)
// $eq : equal (=)
// $ne : not equal (≠)
const orderController= {
    getHighValue: async (req, res)=>{
    
        // điều kiện field totalPrice phải > 1000$
        //nếu ko có đơn nào lớn hơn 1000 thì hiển thị ko có
        //trả dlieu cho client
        try {
            const highTotalPrice = await OrderModel.find({
               totalPrice: { $gt: 1000 },
            })
            res.json({
                message: highTotalPrice.length ? "Orders retrieved successfully" : "No orders found with total price over 1000$",
                data: highTotalPrice
            })

        } catch (error) {
            console.log("Error in getHighValue: ",  error);
            res.status(500).json({
                message: "Server error",
                error: error.message
            })
        }
    }
}
export default orderController;