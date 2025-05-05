const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");
const asyncHandler = require("express-async-handler");

// Xác thực staff dựa trên token
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.staff = await Staff.findById(decoded.id).select("-password");
      
      if (!req.staff || !req.staff.isActive) {
        res.status(401);
        throw new Error("Không được phép truy cập, tài khoản không tồn tại hoặc đã bị vô hiệu hóa");
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Không được phép truy cập, token không hợp lệ");
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error("Không được phép truy cập, không có token");
  }
});

// Kiểm tra quyền sở hữu bài viết
const checkNewsOwnership = asyncHandler(async (req, res, next) => {
  try {
    const newsId = req.params.id;
    const News = require("../models/newsModel");
    
    const news = await News.findById(newsId);
    
    if (!news) {
      res.status(404);
      throw new Error("Bài viết không tồn tại");
    }
    
    // Kiểm tra xem staff có phải là tác giả của bài viết không
    if (news.author.toString() !== req.staff._id.toString()) {
      res.status(403);
      throw new Error("Không có quyền, bạn chỉ có thể chỉnh sửa bài viết do chính mình tạo");
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = { protect, checkNewsOwnership };
