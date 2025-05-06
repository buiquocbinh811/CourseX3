import productRoute from "../routes/productRouter.js";
import CustomerModel from "../models/customer.js";
import mongoose from "mongoose";
import ProductModel from "../models/product.js";

// 5. Lọc danh sách sản phẩm theo khoảng giá
// Viết API để lọc danh sách sản phẩm dựa trên
//  khoảng giá minPrice và maxPrice được truyền vào thông
//  qua query parameters, Nếu không có 1 trong 2,
//  thì trả về toàn bộ danh sách product API có dạng như sau:
// GET /products?minPrice=?&maxPrice=?
//  Ví dụ: GET /products?minPrice=
// 1000&maxPrice=1500 
// sẽ trả về danh sách sản phẩm có giá từ 100$-1500$.

const productController = {
    getMinMaxProduct: async(req, res) => {
        try {
            const {minPrice, maxPrice} = req.query;
            let query = {};

            if(minPrice && maxPrice){
                query.price = {
                    $gte: Number(minPrice),
                    $lte: Number(maxPrice)
                }
            } else if(minPrice){
                query.price = {
                    $gte: Number(minPrice)
                }   
            } else if(maxPrice){
                query.price = {
                    $lte: Number(maxPrice)
                }  
            }
            
            const products = await ProductModel.find(query);
            res.json({
                message: products.length ? 
                    "Products found in price range" : 
                    "No products found in this price range",
                data: products
            });
            
        } catch (error) {
            console.error("Error in getMinMaxProduct: ", error);
            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
};

export default productController;