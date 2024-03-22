const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  date: { type: Date, required: true },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    totalPrice: { type: Number, required: true },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});
module.exports = mongoose.model("Order", orderSchema);
