const { Schema, model } = require("mongoose");

const calculatorSchema = new Schema(
  {
    brix: Number,
    gravity: Number,
    index: Number,
    density: Number,
    weightLb: Number,
    weightKg: Number,
    allLb: Number,
    allKg: Number,
    volGalKg: Number,
    libKg: Number,
    galXL: Number,
    importantFactor: Number
  },
  {
    timestamps: true,
  }
);

module.exports = model("Calculator", calculatorSchema);
