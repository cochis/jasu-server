const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: String,
    title_Es: String,
    text: String,
    test_Es: String,
    imageUrl: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blog", blogSchema);
