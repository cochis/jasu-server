const { Router } = require("express");
const router = Router();

const Fruit = require("../models/Fruit");
const Presentation = require("../models/Presentation");
const Product = require("../models/Product");
const { language } = require("googleapis/build/src/apis/language");
const Calculator = require("../models/Calculator");

router.get("/calculator", async (req, res) => {
  const calculator = await Calculator.find({}).sort({"brix": "asc"}); 
  return res.status(200).json(calculator);
})

router.get("/search", async (req, res) => {
  const { term, lang } = req.query;
  let fruits = [];
  let presentations = [];
  let products = [];

  if (lang.toLowerCase() === "es") {
    fruits = await Fruit.find({
      $or: [
        { name_Es: { $regex: term, $options: "i" } },
        //{ description_Es: { $regex: term, $options: "i" } },
      ],
    }).sort({ name_Es: 1 });
    presentations = await Presentation.find({
      $or: [
        { name_Es: { $regex: term, $options: "i" } },
        //{ description_Es: { $regex: term, $options: "i" } },
      ],
    }).sort({ name_Es: 1 });
    products = await Product.find({
      product_Es: { $regex: term, $options: "i" },
    }).sort({ product_Es: 1 });
  } else {
    fruits = await Fruit.find({
      $or: [
        { name: { $regex: term, $options: "i" } },
        //{ description: { $regex: term, $options: "i" } },
      ],
    }).sort({ name: 1 });
    presentations = await Presentation.find({
      $or: [
        { name: { $regex: term, $options: "i" } },
        //{ description: { $regex: term, $options: "i" } },
      ],
    }).sort({ name: 1 });
    products = await Product.find({
      product: { $regex: term, $options: "i" },
    }).sort({ product: 1 });
  }

  const searchList = [];

  fruits.forEach((fruit) => {
    searchList.push({
      id: fruit._id,
      type: 'fruit',
      name: fruit.name,
      name_Es: fruit.name_Es,
      description: fruit.description,
      description_Es: fruit.description_Es,
      image: fruit.image,
    });
  });

  presentations.forEach((presentation) => {
    searchList.push({
      id: presentation._id,
      type: 'presentation',
      name: presentation.name,
      name_Es: presentation.name_Es,
      description: presentation.description,
      description_Es: presentation.description_Es,
      image: presentation.imageUrl,
    });
  });

  products.forEach((product) => {
    searchList.push({
      id: product._id,
      type: 'product',
      name: product.product,
      name_Es: product.product_Es,
      description: product.description,
      description_Es: product.description_Es,
      image: product.imageUrl,
    });
  });

  if (language === "es") {
    searchList.sort(function (a, b) {
      a = a.name_Es.toLowerCase();
      b = b.name_Es.toLowerCase();

      return a < b ? -1 : a > b ? 1 : 0;
    });
  } else {
    searchList.sort(function (a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      return a < b ? -1 : a > b ? 1 : 0;
    });
  }

  return res.status(200).json(searchList);
});

module.exports = router;
