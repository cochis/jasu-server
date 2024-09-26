const { Router } = require("express");
const router = Router();

const Fruit = require("../models/Fruit");

router.get("/fruits", async (req, res) => {
  const fruits = await Fruit.find({});
  return res.status(200).json(fruits);
});

router.get("/fruit/:id", async (req, res) => {
    const fruit = await Fruit.findById(req.params.id);
    return res.status(200).json(fruit);
});

module.exports = router;
