const { Schema, model } = require("mongoose");

const priceChartSchema = new Schema(
  {
    product: String,
    month: Number,
    year: Number,
    value: Number
  }
);

module.exports = model("PriceChart", priceChartSchema);
