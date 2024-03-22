const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/is-auth");
const checkTypeUser = require("../middleware/isTypeUser");
const authController = require("../controller/auth");
const User = require("../models/user");
const adminController = require("../controller/admin");
const { body } = require("express-validator");
router.post(
  "/search-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.postSearchProduct
);
router.get(
  "/all-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.getProductsAdmin
);

router.get(
  "/dashboard",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.getDashboard
);
router.post(
  "/new-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.postNewProduct
);
router.post(
  "/update-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.postUpdateProduct
);
router.get(
  "/update-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.getUpdateProduct
);
router.delete(
  "/delete-product",
  [checkAuth.checkAdminAuth, checkTypeUser.checkAdmin],
  adminController.deleteProduct
);
router.get(
  "/all-room",
  [checkAuth.checkAdminAuth, checkTypeUser.checkCounselor],
  adminController.getMessage
);
router.get(
  "/detail-room",
  [checkAuth.checkAdminAuth, checkTypeUser.checkCounselor],
  adminController.getDetailMessage
);

////////////////////////user
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
