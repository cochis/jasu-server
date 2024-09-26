const { Schema, model } = require("mongoose");

const presentationSchema = new Schema(
  {
    code: String,
    name: String,
    name_Es: String,
    description: String,
    description_Es: String,
    imageUrl: String,
    category: String,
    subCategory: String,
    subCategory_Es: String,
    color: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("Presentation", presentationSchema);
