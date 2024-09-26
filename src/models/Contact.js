const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    company: String,
    area: String,
    message: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("Contact", contactSchema);
