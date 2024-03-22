const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/is-auth");
const shopController = require("../controller/shop");
const checkTypeUser = require("../middleware/isTypeUser");
const authController = require("../controller/auth");
const { body } = require("express-validator");
const User = require("../models/user");
router.get(
  "/all-product",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.getAllProducts
);
router.get(
  "/detail-product",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.getDetailProduct
);
router.post(
  "/add-cart",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.postCart
);
router.get(
  "/cart",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.getCart
);
router.post(
  "/delete-cart",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.postDeleteCartProduct
);
router.post(
  "/decrement-cart",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.postDecrementCart
);
router.post(
  "/order",
  [
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.postOrder
);
router.get(
  "/order",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.getOrder
);
router.post(
  "/order-detail",
  [checkAuth.checkClientAuth, checkTypeUser.checkClient],
  shopController.postOrderDetail
);
router.post(
  "/signup",
  [
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 8 characters"
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body("phone").notEmpty().withMessage("Phone is required"),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("Không tìm thấy Email của bạn!");
          }
        });
      })
      .trim(),
    body("password", "Password has to be valid.")
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.get("/logout", authController.getLogouts);

module.exports = router;
