const { Router } = require("express");
const router = Router();

const Product = require("../models/Product");
const Presentation = require("../models/Presentation");
const Fruit = require("../models/Fruit");
const PriceChart = require("../models/PriceChart");

router.get("/products", async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(products);
});

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const presentation = await Presentation.findOne({name: {$regex : product.presentation, $options: 'i'}});
  return res.status(200).json({product, presentation});
});

router.get("/product/:fruitName/:presentationName", async (req, res) => {
  const product = await Product.findOne({fruit: req.params.fruitName, presentation: req.params.presentationName});
  return res.status(200).json(product);
});

router.get("/products/topTen", async (req, res) => {
  const products = await Product.find({topTen: "true"});
  return res.status(200).json(products);
});

router.get("/productPrices/:productName", async (req, res) => {
  const productName = req.params.productName
  const prices = await PriceChart.find({product: productName}).sort({"year":"asc", "month": "asc"});
  return res.status(200).json(prices);
});

router.get("/products/:fruitName", async (req, res) => {
  const products = await Product.find({fruit: req.params.fruitName});
  const realProducts = []
  for(const product of products) {
    const presentation = await Presentation.findOne({name: {$regex : product.presentation, $options: 'i'}});
    realProducts.push({product, presentation});
  }
  return res.status(200).json(realProducts);
});

router.get("/productsByPresentation/:presentation", async (req, res) => {
  const products = await Product.find({presentation: {$regex: req.params.presentation, $options: 'i'}});
  const realProducts = []
  for(const product of products) {
    const fruit = await Fruit.findOne({name: {$regex : product.fruit, $options: 'i'}});
    realProducts.push({product, fruit});
  }
  return res.status(200).json(realProducts);
});

router.get("/productsAvailable", async (req, res) => {
  const products = await Product.find({volume: {$gt: 0}}).sort({volume: -1});
  console.log(products)
  const oils = [];
  const juices = [];
  for(const product of products) {
    const presentation = await Presentation.findOne({name: {$regex : product.presentation, $options: 'i'}});
    if(presentation.category === "Oils") {
      oils.push({product, presentation});
    } else if(presentation.category === "Juices") {
      juices.push({product, presentation})
    }
  }
  return res.status(200).json({juices, oils});
});

module.exports = router;
