const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], minlength: 3 },
  price: { type: Number, required: true, min: [1, "Price must be positive"] },
  category: { type: String, enum: ["electronics", "books", "clothing"] },
  sku: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => /^[A-Z]{3}-\d{4}$/.test(v),
      message: (p) => `${p.value} is not a valid SKU`,
    },
  },
});

// virtual and instance method
productSchema.virtual("priceWithTax").get(function () {
  return this.price * 1.18;
});

productSchema.methods.isExpensive = function () {
  return this.price > 1000;
};

module.exports = mongoose.model("Product", productSchema);
