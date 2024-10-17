const express = require("express");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
const path = require('path')
const { syncFruits } = require("./cron/fruits-sync");
const { syncPresentations } = require("./cron/presentations-sync");
const { syncProducts } = require("./cron/product-sync");
require("./database");

const generateData = async () => {
  await syncFruits();
  await syncPresentations();
  await syncProducts();
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
]);

app.get("/get-data", async (req, res) => {
  await generateData();
  res.send("Data generated successfully");
});

app.get('*', function (req, res, next) {
  res.sendFile(path.resolve('client/index.html'))
})
app.listen(3000);
console.log("Server on port", 3000);

cron.schedule("0 17 * * 5", generateData);
