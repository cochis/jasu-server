const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    company: String,
    verified: Boolean
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
