const { getSheetResponse } = require("./sync");
const spreadsheetId = "1dUcHg1Ly65y4q-mKzbld7owr1wGD3AkNCtNDIBtWmp0";
const Calculator = require("../models/Calculator");

const syncCalculator = async () => {

  const ranges = {
    brix: "A",
    gravity: "B",
    index: "C",
    density: "D",
    weightLb: "E",
    weightKg: "F",
    allLb: "G",
    allKg: "H",
    volGalKg: "I",
    libKg: "J"
  };

  await Calculator.deleteMany({});

  const data = await getSheetResponse(ranges, spreadsheetId, 'Brix');

  const clearValue = (value) => {
    const newValue = value.toString().replace("-", "").trim("");

    return newValue !== "" ? newValue : "0"
  }

  const calcs = []
  for (let index = 0; index < data[0].length; index++) {
    const calc = {
        brix: data[0][index],
        gravity: data[1].length > index ? data[1][index] : "",
        index: data[2].length > index ? data[2][index] : "",
        density: clearValue(data[3].length > index ? data[3][index] : ""),
        weightLb: data[4].length > index ? data[4][index] : "",
        weightKg: data[5].length > index ? data[5][index] : "",
        allLb: data[6].length > index ? data[6][index] : "",
        allKg: data[7].length > index ? data[7][index] : "",
        volGalKg: clearValue(data[8].length > index ? data[8][index] : ""),
        libKg: clearValue(data[9].length > index ? data[9][index] : ""),
        galXL: 0,
        importantFactor: 0
      };

      calc.galXL = 1 / calc.weightKg;
      calc.importantFactor = calc.galXL * calc.allLb;
      
      calcs.push(calc);
  }

  await Calculator.insertMany(calcs);
};

module.exports = {
  syncCalculator,
};
