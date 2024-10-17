const { Schema, model } = require("mongoose");

const fruitSchema = new Schema(
  {
    code: String,
    name: String,
    description: String,
    name_Es: String,
    description_Es: String,
    image: String,
    countries: String,
    category: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("Fruit", fruitSchema);
