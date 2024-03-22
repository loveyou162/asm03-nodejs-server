exports.checkClientAuth = (req, res, next) => {
  if (req.session.clientLoggedIn || req.session.adminLoggedIn) {
    console.log("check auth");
    // Nếu người dùng đã đăng nhập, cho phép tiếp tục thực hiện các thao tác trong request
    next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về một lỗi hoặc chuyển hướng đến trang đăng nhập
    return res
      .status(401)
      .json({ message: "Unauthorized, client hoặc admin chưa đăng nhập" });
  }
};
exports.checkAdminAuth = (req, res, next) => {
  if (req.session.adminLoggedIn || req.session.counselorsLoggedIn) {
    console.log("check auth");
    // Nếu người dùng đã đăng nhập, cho phép tiếp tục thực hiện các thao tác trong request
    next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về một lỗi hoặc chuyển hướng đến trang đăng nhập
    return res
      .status(401)
      .json({ message: "Unauthorized, admin chưa đăng nhập" });
  }
};
