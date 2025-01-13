const express = require("express");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
const path = require('path')
const { syncFruits } = require("./cron/fruits-sync");
const { syncPresentations } = require("./cron/presentations-sync");
const { syncProducts } = require("./cron/product-sync");
const { syncFruitWorldSeason } = require("./cron/world-map-sync");
const { syncPriceChart } = require("./cron/price-chart-sync");
const { syncCalculator } = require("./cron/calculator-sync");
require("./database");

const generateData = async () => {
  //await syncFruits();
  //await syncPresentations();
  //await syncProducts();
  //await syncFruitWorldSeason();
  //await syncPriceChart();
  await syncCalculator();
}

app.use(cors());
app.use(express.json());
app.use('/', express.static('client', { redirect: false }))
app.use("/api", [
  require("./routes/UserController"),
  require("./routes/ContactController"),
  require("./routes/FruitController"),
  require("./routes/BlogController"),
  require("./routes/PresentationController"),
  require("./routes/ProductController"),
  require("./routes/SearchController"),
]);

app.get("/get-data", async (req, res) => {
  await generateData();
  res.send("Data generated successfully");
});
app.get('*', function (req, res, next) {
  res.sendFile(path.resolve('client/index.html'))
})
app.listen(3040);
console.log("Server on port", 3040);

cron.schedule("0 17 * * 5", generateData);
