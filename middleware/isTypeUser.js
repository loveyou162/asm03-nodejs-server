exports.checkClient = (req, res, next) => {
  const role = req.session.role;
  if (!role) {
    // Nếu không có vai trò được xác định, chuyển hướng hoặc trả về lỗi
    return res.status(403).json({ message: "Forbidden" });
  }
  if (role === "client" || role === "admin") {
    // res.json({ role });
    return next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về một lỗi hoặc chuyển hướng đến trang đăng nhập
    return res
      .status(401)
      .json({ message: "Unauthorized, chỉ cho phép từ client hoặc admin" });
  }
};
exports.checkAdmin = (req, res, next) => {
  const role = req.session.role;
  if (!role) {
    // Nếu không có vai trò được xác định, chuyển hướng hoặc trả về lỗi
    return res.status(403).json({ message: "Forbidden" });
  }
  if (role === "admin") {
    return next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về một lỗi hoặc chuyển hướng đến trang đăng nhập
    return res
      .status(401)
      .json({ message: "Unauthorized, chỉ cho phép từ admin" });
  }
};
exports.checkCounselor = (req, res, next) => {
  const role = req.session.role;
  if (!role) {
    // Nếu không có vai trò được xác định, chuyển hướng hoặc trả về lỗi
    return res.status(403).json({ message: "Forbidden" });
  }
  if (role === "counselors" || role === "admin") {
    return next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về một lỗi hoặc chuyển hướng đến trang đăng nhập
    return res
      .status(401)
      .json({ message: "Unauthorized, chỉ cho phép từ tư vấn viên" });
  }
};
