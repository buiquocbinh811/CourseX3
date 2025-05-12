import User from "../models/User.js";

// Middleware kiểm tra apiKey có trg request ko
export const checkApiKey = async (req, res, next) => {
  try {
    //api rong
    const { apiKey } = req.query;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "You must provide apiKey",
      });
    }

    // Tách các phần từ apiKey
    const parts = apiKey.split("$-");
    if (parts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Error apiKey format",
      });
    }

    // lay ra userId va email xac thuc
    // Lấy userId và email từ apiKey
    const userId = parts[0].replace("mern-", "");

    // Kiểm tra userId có phải ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const email = parts[1];

    // Tìm user với ObjectId
    const user = await User.findById(userId);

    if (!user || user.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key",
      });
    }

    // neu thay thi next
    req.user = user;
    next();
  } catch (error) {
    console.log("Error authenticated apiKey ", error);
    res.status(400).json({
      data: null,
      success: false,
      error: error?.message,
    });
  }
};
