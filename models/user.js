const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  role: {
    type: String,
    required: true,
    enums: ["client", "admin", "counselors"],
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

//Phương thức addToCart để thêm một sản phẩm vào giỏ hàng của người dùng
userSchema.methods.addToCart = function (product) {
  console.log(24, product._id.toString());
  //tìm kiếm sản phẩm trong giỏ hàng của người dùng
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    console.log(27, cp.productId.toString());
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updateCartItem = [...this.cart.items];
  //nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updateCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updateCartItem.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  //Cập nhật giỏ hàng với các mặt hàng mới được cập nhạt số lượng sản phẩm
  const updateCart = {
    items: updateCartItem,
  };
  this.cart = updateCart;
  return this.save();
};
userSchema.methods.decrementToCart = function (product) {
  console.log(24, product._id.toString());
  // Tìm kiếm sản phẩm trong giỏ hàng của người dùng
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    console.log(27, cp.productId.toString());
    return cp.productId.toString() === product._id.toString();
  });

  // Nếu sản phẩm đã tồn tại trong giỏ hàng
  if (cartProductIndex >= 0) {
    // Nếu số lượng của sản phẩm đó lớn hơn 1, giảm số lượng đi 1
    if (this.cart.items[cartProductIndex].quantity > 1) {
      const updateCartItem = [...this.cart.items];
      const newQuantity = this.cart.items[cartProductIndex].quantity - 1;
      updateCartItem[cartProductIndex].quantity = newQuantity;

      // Cập nhật giỏ hàng với số lượng mới
      this.cart.items = updateCartItem;
    } else {
      // Nếu chỉ có một sản phẩm trong giỏ hàng, loại bỏ sản phẩm đó khỏi giỏ hàng
      this.cart.items = this.cart.items.filter((item) => {
        return item.productId.toString() !== product._id.toString();
      });
    }
  }

  // Lưu và trả về giỏ hàng đã được cập nhật
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
