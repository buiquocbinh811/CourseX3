import mongoose from "mongoose";
import customers from "./models/customer.js";
import products from "./models/product.js";
import orders from "./models/order.js";

mongoose.connect("mongodb://localhost:27017/shop");

const seed = async () => {
  try {
    // Xóa dữ liệu cũ
    await customers.deleteMany();
    await products.deleteMany();
    await orders.deleteMany();

    // Tạo customers
    const customer1 = await customers.create({
      name: "Bui Quoc Binh",
      email: "binh@example.com",
      age: 20
    });

    const customer2 = await customers.create({
      name: "Yen",
      email: "yen@gmail.com",
      age: 19
    });

    const customer3 = await customers.create({
      name: "Rolf Quoc Sinha",
      email: "brim@example.comy",
      age: 29
    });

    const customer4 = await customers.create({
      name: "Yom",
      email: "yom@gmail.com",
      age: 19
    });

    // Tạo products
    const product1 = await products.create({
      name: "Phone",
      price: 500,
      quantity: 10
    });

    const product2 = await products.create({
      name: "Gun",
      price: 500,
      quantity: 10
    });

    const product3 = await products.create({
      name: "Phong",
      price: 500,
      quantity: 10
    });

    const product4 = await products.create({
      name: "Gun",
      price: 500,
      quantity: 10
    });

    // Tạo orders
    await orders.create({
      customerId: customer1._id,
      productId: product1._id,
      quantity: 2,
      totalPrice: 1000
    });

    await orders.create({
      customerId: customer1._id,
      productId: product2._id,
      quantity: 2,
      totalPrice: 1000
    });

    await orders.create({
      customerId: customer4._id,
      productId: product4._id,
      quantity: 2,
      totalPrice: 1000
    });


    console.log("Database seeded successfully with sample data!");
    console.log("Sample data inserted:");
    console.log("\nCustomers:", await customers.find());
    console.log("\nProducts:", await products.find());
    console.log("\nOrders:", await orders.find());
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
};

seed();