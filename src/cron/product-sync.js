const { DriveImageToURL, getSheetResponse } = require("./sync");
const spreadsheetId = "1KSEwxP6rmBvGi83_D38DaGEgoiK0ldJh26Mcrp16oMM";
const Product = require("../models/Product");

const syncProducts = async () => {
  try {
    const ranges = {
      code: "A",
      product: "B",
      product_Es: "R",
      fruit: "C",
      fruit_Es: "S",
      presentation: "E",
      presentation_Es: "U",
      type: "F",
      type_Es: "V",
      countryOrigin: "G",
      countryOrigin_Es: "W",
      shelfLife: "H",
      shelfLife_Es: "X",
      description: "I",
      description_Es: "Y",
      imageUrl: "K",
      spsecUrl: "M",
    };
    const data = await getSheetResponse(ranges, spreadsheetId, "Producto");

    for (let index = 0; index < data[0].length; index++) {
      const productName = data[1].length > index ? data[1][index] : "";

      if(!productName || data[0][index] === "#") {
        continue;
      }

      const product = {
        code: data[0][index],
        product: productName,
        product_Es: data[2].length > index ? data[2][index] : "",
        fruit: data[3].length > index ? data[3][index] : "",
        fruit_Es: data[4].length > index ? data[4][index] : "",
        presentation: data[5].length > index ? data[5][index] : "",
        presentation_Es: data[6].length > index ? data[6][index] : "",
        type: data[7].length > index ? data[7][index] : "",
        type_Es: data[8].length > index ? data[8][index] : "",
        countryOrigin: data[9].length > index ? data[9][index] : "",
        countryOrigin_Es: data[10].length > index ? data[10][index] : "",
        shelfLife: data[11].length > index ? data[11][index] : "",
        shelfLife_Es: data[12].length > index ? data[12][index] : "",
        description: data[13].length > index ? data[13][index] : "",
        description_Es: data[14].length > index ? data[14][index] : "",
        imageUrl: data[15].length > index ? DriveImageToURL(data[15][index]) : "",
        spsecUrl: data[16].length > index ? DriveImageToURL(data[16][index]) : "",
      };

      const query = { code: product.code };
      const options = { upsert: true };
      const updateDoc = {
        $set: product,
      };

      console.log(`Processing ${product.product} - ${product.presentation}...`);
      await Product.updateOne(query, updateDoc, options);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  syncProducts,
};
