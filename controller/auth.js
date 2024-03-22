const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");
const sendEmailService = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "caoboi520@gmail.com",
      pass: "dcnzdobumhlxmjrf",
    },
  });
  const info = await transporter.sendMail({
    from: '"Thắng Phạm 👻" <caoboi520@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
  return info;
};
exports.postSignup = async (req, res, next) => {
  console.log(25, req.session.id);
  const { fullname, email, password, phone, role } = req.body;
  const error = validationResult(req);
  console.log(27, error.array());

  try {
    if (!error.isEmpty()) {
      return res.json({ errMessage: error.array(), isSignup: false });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo người dùng mới
    const user = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role,
      cart: {
        items: [],
      },
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

    // Gửi email thông báo đăng ký thành công
    const subject = "Signup Succeeded!";
    const html = "<h1>You successfully signed up</h1>";
    await sendEmailService(email, subject, html);
    res.json({ message: "Bạn đã đăng kí thành công", isSignup: true });
  } catch (error) {
    // Xử lý lỗi
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const error = validationResult(req);

    const user = await User.findOne({ email: email });
    if (!error.isEmpty()) {
      return res.json({ errMessage: error.array(), isLogin: false });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      console.log(doMatch);
      if (user.role === "client") {
        req.session.clientLoggedIn = true;
        req.session.user = user;
        req.session.role = user.role;
      } else if (user.role === "admin") {
        req.session.adminLoggedIn = true;
        req.session.user = user;
        req.session.role = user.role;
      } else {
        req.session.counselorsLoggedIn = true;
        req.session.user = user;
        req.session.role = user.role;
      }
      req.session.save((err) => {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
      });
      console.log("Bạn đã đăng nhập thành công");

      res.json({
        user: user,
        isLogin: true,
        role: user.role,
      });
    } else {
      return res.json({
        errMessage: [{ msg: "Invalid email or password." }],
        isLogin: false,
      });
    }
  } catch (error) {
    return next(error);
  }
};
exports.getLogouts = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.send("logout");
  });
};
