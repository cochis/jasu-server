const { Router } = require("express");
const router = Router();

const Product = require("../models/Product");

router.get("/products", async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(products);
});

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  return res.status(200).json(product);
});

router.get("/product/:fruitName/:presentationName", async (req, res) => {
  const product = await Product.findOne({fruit: req.params.fruitName, presentation: req.params.presentationName});
  return res.status(200).json(product);
});

module.exports = router;
