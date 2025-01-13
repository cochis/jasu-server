const { getSheetResponse } = require("./sync");
const spreadsheetId = "1vXMrlCw9KdX87fpRXhUWxXBrvlc5cQvGFsmTSO9OveA";
const Product = require("../models/Product");
const PriceChart = require("../models/PriceChart");

const syncPriceChart = async () => {
  const products = await Product.find({});

  const ranges = {
    date: "A",
    presentation1: "B",
    presentation2: "C",
    presentation3: "D",
    presentation4: "E",
    presentation5: "F",
    presentation6: "G",
    presentation7: "H",
    presentation8: "I",
    presentation9: "J",
    presentation10: "K",
    presentation11: "L",
    presentation12: "M",
    presentation13: "N",
    presentation14: "O"
  };

  await PriceChart.deleteMany({});
  products.forEach(async (product) => {
    try {
      const fruit = product.fruit;
      const data = await getSheetResponse(ranges, spreadsheetId, fruit);
      const indexProduct = 0;
      if(data) {
        let presentation = product.presentation
        if(presentation === "NFC Unpasteurized") {
          presentation = "NFC";
        }
        const dataByPresentation = data.find(
          (d) => d[indexProduct] === presentation
        );
  
        if (dataByPresentation) {
          data[indexProduct].forEach(async (date, index) => {
            if (index > 1) {
              let value = dataByPresentation[index] ? dataByPresentation[index] : 0;
              if (value.toString().includes("#REF!") || isNaN(value)) {
                value = 0;
              }
              const newDate = new Date(Date.UTC(0, 0, date));
              await PriceChart.insertMany([
                {
                  product: product.product,
                  month: newDate.getMonth() + 1,
                  year: newDate.getFullYear(),
                  value: Number(value).toFixed(2),
                },
              ]);
            }
          });
        }
      }
    } catch(e) {
    }
    
  });
};

module.exports = {
  syncPriceChart,
};
