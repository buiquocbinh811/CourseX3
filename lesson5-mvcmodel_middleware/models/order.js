import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'customers',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number, 
    required: true,
  },
  totalPrice: {
    type: Number, // Tổng giá trị đơn hàng (price * quantity)
    required: true
  },
  }
)
const OrderModel = mongoose.model('orders', orderSchema);
export default OrderModel;