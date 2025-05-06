import { Router } from "express";
import productController from "../controllers/productController.js"
const productRoute = Router();
// 5. Lọc danh sách sản phẩm theo khoảng giá
// Viết API để lọc danh sách sản phẩm dựa trên
//  khoảng giá minPrice và maxPrice được truyền vào thông
//  qua query parameters, Nếu không có 1 trong 2,
//  thì trả về toàn bộ danh sách product API có dạng như sau:
// GET /products?minPrice=?&maxPrice=?
//  Ví dụ: GET /products?minPrice=
// 1000&maxPrice=1500 
// sẽ trả về danh sách sản phẩm có giá từ 100$-1500$.

productRoute.get("/", productController.getMinMaxProduct);
export default productRoute;