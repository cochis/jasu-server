const { Schema, model } = require("mongoose");

const fruitWorldSeasonSchema = new Schema(
  {
    fruit: String,
    country: String,
    organic: Number,
    january: Number,
    feburary: Number,
    march: Number,
    april: Number,
    may: Number,
    june: Number,
    july: Number,
    august: Number,
    september: Number,
    october: Number,
    november: Number,
    december: Number
  }
);

module.exports = model("FruitWorldSeason", fruitWorldSeasonSchema);
