const express = require("express");
const port = 5000;
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const http = require("http");
const server = http.createServer(app);
const initSocketIO = require("./controller/socket");
const User = require("./models/user");
initSocketIO(server);

const MONGODB_URI = `mongodb+srv://caoboi520:Aw8umOX1tKDxMVsg@cluster0.fdehoqk.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`;

const clientStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "client-sessions",
});
const adminStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "admin-sessions",
});
const csrfProtection = csrf();

const shopRoute = require("./router/shop");
const adminRoute = require("./router/admin");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://admin-nodejs-03-4a9f5.web.app",
      "https://client-nodejs-03-41bd8.web.app",
      "http://localhost:5000",
    ],
    credentials: true,
    method: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  })
);
//tạo session cho client
app.use(
  "/shop",
  session({
    secret: "client secret",
    resave: false,
    saveUninitialized: false,
    store: clientStore,
    cookie: { secure: false, maxAge: 3000 * 60 * 60 },
  })
);
//tạo session cho admin
app.use(
  "/admin",
  session({
    secret: "admin secret",
    resave: false,
    saveUninitialized: false,
    store: adminStore,
    cookie: { secure: false, maxAge: 3000 * 60 * 60 },
  })
);
// app.use(helmet());
// Cấu hình chính sách bảo mật nội dung (CSP) cho ứng dụng
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // Cho phép hiển thị ảnh từ đường dẫn /images
      "img-src": ["'self'", "http://localhost:5000/images"],
    },
  })
);
//dùng compression để nén các file giúp trang web tải nhanh hơn
app.use(compression());
app.use(express.json());
app.use(cookieParser());
//tạo công cụ lưu trữ cho multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Math.random() + "-" + file.originalname);
  },
});

//lọc file ảnh với mimetype
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, filter: fileFilter }).array("images", 5)
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/shop/some-route", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.get("/admin/some-route", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
//trong form ở client thêm input hidden có value là csrfToken

app.use((req, res, next) => {
  console.log(65, req.session.id);
  if (!req.session.user) {
    console.log("no user");
    return next();
  }

  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      console.log("app-76", user);
      if (!user) {
        return next();
      }
      req.user = user;

      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
  console.log("app-69", req.session.user._id);
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: "error" });
});

// app.use("/user", authRoute);
app.use("/shop", shopRoute);
app.use("/admin", adminRoute);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  console.log("app-46 ", res.locals.isAuthenticated);
  // res.locals.csrfToken = req.csrfToken();
  next();
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    server.listen(port, () => {
      console.log(`app running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
