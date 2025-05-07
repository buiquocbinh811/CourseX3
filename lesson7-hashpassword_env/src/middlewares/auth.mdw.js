const isAuthenticated = true; 

const authentication = (req, res, next) => {
    if (!isAuthenticated) {
    //1. Middlewares để xác thực người dùng
    //Authentication middleware all routes
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Người dùng đã xác minh danh tính
    // Được phép truy cập vào hệ thống
    next();
};


const adminAuthorization = (req, res, next) => {
    const { userRole } = req.query || {};
    if (userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

export { authentication, adminAuthorization };