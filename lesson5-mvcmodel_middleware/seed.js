// import mongoose from "mongoose";
// import Customer from "./models/customer.js";  // Chú ý đổi tên ở đây
// import Product from "./models/product.js";
// import Order from "./models/order.js";

// mongoose.connect("mongodb://localhost:27017/shop");

// const seed = async () => {
//   try {
//     // Xóa dữ liệu cũ (nếu cần)
//     // await Customer.deleteMany();
//     // await Product.deleteMany();
//     // await Order.deleteMany();

//     // Thêm dữ liệu mới
//     const customerData = await Customer.create({ // Đổi tên biến thành customerData
//       name: "Alice",
//       email: "alice@example.com",
//       age: 25,
//     });

//     const productData = await Product.create({
//       name: "Phone",
//       price: 500,
//       quantity: 10,
//     });

//     await Order.create({
//       customerId: customerData._id,
//       productId: productData._id,
//       quantity: 2,
//       totalPrice: 1000,
//     });

//     console.log("Database seeded!");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   }
// };

// seed();
