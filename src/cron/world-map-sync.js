const { DriveImageToURL, getSheetResponse } = require("./sync");
const spreadsheetId = "1R-z4BHC6czFpj7NTvOthuIMMojhys-0nhps9h4Z1Mro";
const FruitWorldSeason = require("../models/FruitWorldSeason");
const Fruit = require("../models/Fruit");

const syncFruitWorldSeason = async () => {
  const fruits = await Fruit.find({});

  const ranges = {
    country: "B",
    organic: "D",
    january: "E",
    february: "F",
    march: "G",
    april: "H",
    may: "I",
    june: "J",
    july: "K",
    august: "L",
    september: "M",
    october: "N",
    noveber: "O",
    december: "P",
  };
  await FruitWorldSeason.deleteMany({});
  fruits.forEach(async (fruit) => {
    const data = await getSheetResponse(ranges, spreadsheetId, fruit.name);
    const fruitName = fruit.name;
    const [
      countryArray,
      organicArray,
      january,
      feburary,
      march,
      april,
      may,
      june,
      july,
      august,
      september,
      october,
      november,
      december,
    ] = data;

    items = [];
    countryArray.forEach((country, index) => {
      if(index > 0) {
        const item = {
          fruit: fruitName,
          country,
          organic: organicArray[index],
          january: january[index],
          feburary: feburary[index],
          march: march[index],
          april: april[index],
          may: may[index],
          june: june[index],
          july: july[index],
          august: august[index],
          september: september[index],
          october: october[index],
          november: november[index],
          december: december[index],
        }
        items.push(item);
      }
    });

    await FruitWorldSeason.insertMany(items);
  });
};

module.exports = {
  syncFruitWorldSeason,
};
