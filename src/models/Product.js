const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    code: String,
    product: String,
    product_Es: String,
    fruit: String,
    fruit_Es: String,
    presentation: String,
    presentation_Es: String,
    type: String,
    type_Es: String,
    countryOrigin: String,
    countryOrigin_Es: String,
    shelfLife: String,
    shelfLife_Es: String,
    description: String,
    description_Es: String,
    imageUrl: String,
    spsecUrl: String,
    topTen: String,
    volume: Number,
    price: Number,
    variety: String,
    variety_Es: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", productSchema);
