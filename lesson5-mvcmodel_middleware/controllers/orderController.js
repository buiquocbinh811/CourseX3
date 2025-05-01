import mongoose from "mongoose";
import orderRoute from "../routes/ordersRouter.js";
import OrderModel from "../models/order.js";
import CustomerModel from "../models/customer.js";
import ProductModel from "../models/product.js";
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
const orderController = {
  getHighValue: async (req, res) => {
    // điều kiện field totalPrice phải > 1000$
    //nếu ko có đơn nào lớn hơn 1000 thì hiển thị ko có
    //trả dlieu cho client
    try {
      const highTotalPrice = await OrderModel.find({
        totalPrice: { $gt: 1000 },
      });
      res.json({
        message: highTotalPrice.length
          ? "Orders retrieved successfully"
          : "No orders found with total price over 1000$",
        data: highTotalPrice,
      });
    } catch (error) {
      console.log("Error in getHighValue: ", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
  //  7. Tạo mới đơn hàng
  // Viết API để thêm một đơn hàng mới vào danh sách đơn hàng.
  // POST /orders
  // Yêu cầu:
  // Nhận thông tin đơn hàng từ body của request (bao gồm customerId, productId,
  //  quantity).
  // Thực hiện viết middleware kiểm tra tồn tại các trường yêu cầu
  // quantity phải hợp lệ (<= quantity của product tức số lượng sp còn lại)
  // Tính totalPrice dựa trên price của sản phẩm và quantity.
  // Thêm đơn hàng vào mảng orders và trả về thông tin đơn hàng mới thêm.
  // Khi đơn hàng được lên thành công, số lượng của sản phẩm phải bị giảm
  createOrder: async (req, res) => {
    const { customerId, productId, quantity } = req.body;
    try {
        // Basic validation
        if (!customerId || !productId || !quantity) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }


        // Check customer exists - pass ID directly
        const existingCustomer = await CustomerModel.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Check product exists - pass ID directly
        const existingProduct = await ProductModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Validate quantity
        if (quantity <= 0 || quantity > existingProduct.quantity) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }

        // Calculate total price
        const totalPrice = quantity * existingProduct.price;

        // Create order
        const newOrder = await OrderModel.create({
            customerId,
            productId,
            quantity,
            totalPrice
        });

        // Update product quantity
        await ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { quantity: -quantity } },
            { new: true }
        );

        res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
  },
//   8. PUT - Cập nhật số lượng sản phẩm trong đơn hàng
//   Viết API để cập nhật số lượng sản phẩm trong một đơn hàng dựa trên orderId.
//   PUT /orders/:orderId
//   Yêu cầu:
//   Nhận thông tin cập nhật từ body của request (bao gồm quantity).
//   Tìm đơn hàng dựa trên orderId, cập nhật quantity và 
// tính toán lại totalPrice.
//   Nếu không tìm thấy đơn hàng, trả về lỗi 404.
  updateQuantityOrder: async(req, res) => {
    const { orderId } = req.params;
    const { quantity } = req.body;
    
    try {
        // 1. Validate input
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // 2. Kiểm tra orderId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Order ID invalid format"
            });
        }

        // 3. Tìm đơn hàng cần cập nhật và populate thông tin sản phẩm
        const existingOrder = await OrderModel.findById(orderId).populate('productId');
        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // 4. Tính toán điều chỉnh số lượng
        const quantityDiff = quantity - existingOrder.quantity;
        const product = existingOrder.productId; // Lấy thông tin sản phẩm từ order đã populate

        // 5. Kiểm tra số lượng tồn kho
        if (quantityDiff > 0 && product.quantity < quantityDiff) {
            return res.status(400).json({
                message: "Quantity exceeds available stock"
            });
        }

        // 6. Cập nhật số lượng sản phẩm trong kho
        await ProductModel.findByIdAndUpdate(
            product._id,
            { $inc: { quantity: -quantityDiff } },
            { new: true }
        );

        // 7. Cập nhật đơn hàng với số lượng và tổng tiền mới
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                quantity: quantity,
                totalPrice: quantity * product.price
            },
            { new: true }
        ).populate('productId');

        res.json({
            message: "Order updated successfully",
            data: updatedOrder
        });

    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
}
};
export default orderController;
