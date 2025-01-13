const { Router } = require("express");
const router = Router();

const Fruit = require("../models/Fruit");
const FruitWorldSeason = require("../models/FruitWorldSeason");

router.get("/fruits", async (req, res) => {
  const fruits = await Fruit.find({});
  return res.status(200).json(fruits);
});

router.get("/fruit/:id", async (req, res) => {
    const fruit = await Fruit.findById(req.params.id);
    return res.status(200).json(fruit);
});

router.get("/fruit/:fruitName/season", async (req, res) => {
  const season = await FruitWorldSeason.find({fruit: req.params.fruitName});
  return res.status(200).json(season);
});

module.exports = router;
