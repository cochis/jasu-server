const { DriveImageToURL, getSheetResponse } = require("./sync");
const spreadsheetId = '1KSEwxP6rmBvGi83_D38DaGEgoiK0ldJh26Mcrp16oMM'
const Fruit = require("../models/Fruit");

const syncFruits = async () => {
  try {
    const ranges = {
      id: "A",
      nameEs: "L",
      nameEn: "B",
      picture: "H",
      descriptionEs: "P",
      descriptionEn: "F",
      category: "I",
      countries: "E"
    };
    const data = await getSheetResponse(ranges, spreadsheetId, 'Fruta');

    for (let index = 0; index < data[0].length; index++) {
      if(data[0][index] === "#") {
        continue;
      }
      const fruit = {
        code: data[0][index],
        name_Es: data[1].length > index ? data[1][index] : "",
        name: data[2].length > index ? data[2][index] : "",
        image: data[3].length > index ? DriveImageToURL(data[3][index]) : "",
        description_Es: data[4].length > index ? data[4][index] : "",
        description: data[5].length > index ? data[5][index] : "",
        category: data[6].length > index ? data[6][index] : "",
        countries: data[7].length > index ? data[7][index] : ""
      };
      
      const query = { code:  fruit.code};
      const options = { upsert: true };
      const updateDoc = {
        $set: fruit,
      };

      console.log(`Processing ${fruit.name}...`)
      await Fruit.updateOne(query, updateDoc, options);
    }
    
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  syncFruits
}