const { DriveImageToURL, getSheetResponse } = require("./sync");
const spreadsheetId = "1KSEwxP6rmBvGi83_D38DaGEgoiK0ldJh26Mcrp16oMM";
const Product = require("../models/Product");

const syncProducts = async () => {
  try {
    const ranges = {
      code: "A",
      product: "B",
      product_Es: "V",
      fruit: "C",
      fruit_Es: "W",
      presentation: "E",
      presentation_Es: "Y",
      type: "F",
      type_Es: "Z",
      countryOrigin: "G",
      countryOrigin_Es: "AA",
      shelfLife: "H",
      shelfLife_Es: "AB",
      description: "I",
      description_Es: "AC",
      imageUrl: "K",
      spsecUrl: "M",
      topTen: "Q",
      volume: "R",
      price: "S",
      variety: "D",
      variety_Es: "X",
    };
    const data = await getSheetResponse(
      ranges,
      spreadsheetId,
      "Copy of Producto"
    );
    await Product.deleteMany({});
    for (let index = 0; index < data[0].length; index++) {
      const productName = data[1].length > index ? data[1][index] : "";

      if (!productName || data[0][index] === "#") {
        continue;
      }

      const product = {
        code: data[0][index],
        product: productName,
        product_Es: data[2].length > index ? data[2][index] : "",
        fruit: (
          (data[3].length > index ? data[3][index] : "") +
          " " +
          data[20][index]
        ).trim(),
        fruit_Es: (
          (data[4].length > index ? data[4][index] : "") +
          " " +
          data[21][index]
        ).trim(),
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
        imageUrl:
          data[15].length > index ? DriveImageToURL(data[15][index]) : "",
        spsecUrl:
          data[16].length > index ? DriveImageToURL(data[16][index]) : "",
        topTen: data[17].length > index ? data[17][index] : "",
        volume: data[18].length > index ? data[18][index] : 0,
        price: data[19].length > index ? data[19][index] : 0,
        variety: data[20].length > index ? data[20][index] : "",
        variety_Es: data[21].length > index ? data[21][index] : "",
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
