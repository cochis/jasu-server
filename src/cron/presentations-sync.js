const { DriveImageToURL, getSheetResponse } = require("./sync");
const spreadsheetId = "1KSEwxP6rmBvGi83_D38DaGEgoiK0ldJh26Mcrp16oMM";
const Presentation = require("../models/Presentation");

const addSubcategoryAndColor = (presentation) => {
  const id = Number(presentation.code.replace("PR-", ""));

  switch (id) {
    case 0:
    case 1:
    case 2:
    case 12:
    case 14:
    case 15:
    case 17:
    case 18:
    case 19:
    case 22:
    case 25:
      presentation.color = "red";
      break;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      presentation.color = "yellow";
      break;
    default:
      presentation.color = "green";
      break;
  }

  switch (presentation.name) {
    case "CPO Type A":
      presentation.name = "CPO";
      presentation.name_Es = "Aceite Prensado en Frío";
      presentation.subCategory = "Type A";
      presentation.subCategory_Es = "Tipo A";
      break;
    case "CPO Type B":
      presentation.name = "CPO";
      presentation.name_Es = "Aceite Prensado en Frío";
      presentation.subCategory = "Type B";
      presentation.subCategory_Es = "Tipo B";
      break;
    case "CPO X3 Fold":
      presentation.name = "CPO";
      presentation.name_Es = "Aceite Prensado en Frío";
      presentation.subCategory = "x3 Fold";
      presentation.subCategory_Es = "Concentrado 3x";
      break;
    case "CPO X5 Fold":
      presentation.name = "CPO";
      presentation.name_Es = "Aceite Prensado en Frío";
      presentation.subCategory = "x5 Fold";
      presentation.subCategory_Es = "Concentrado 5x";
      break;
    case "CPO X10 Fold":
      presentation.name = "CPO";
      presentation.name_Es = "Aceite Prensado en Frío";
      presentation.subCategory = "x10 Fold";
      presentation.subCategory_Es = "Concentrado 10x";
      break;
  }

  return presentation;
};

const syncPresentations = async () => {
  try {
    const ranges = {
      id: "A",
      nameEs: "I",
      nameEn: "B",
      image: "E",
      descriptionEs: "J",
      descriptionEn: "C",
      category: "F",
    };
    const data = await getSheetResponse(ranges, spreadsheetId, "Presentacion");
    for (let index = 0; index < data[0].length; index++) {
      const name_Es = data[1].length > index ? data[1][index] : "";
      const name = data[2].length > index ? data[2][index] : "";
      const description = data[5].length > index ? data[5][index] : "";

      if (!name || !name_Es || !description || data[0][index] === "#") {
        continue;
      }

      const presentation = addSubcategoryAndColor({
        code: data[0][index],
        name_Es,
        name,
        imageUrl: data[3].length > index ? DriveImageToURL(data[3][index]) : "",
        description_Es: data[4].length > index ? data[4][index] : "",
        description,
        category: data[6].length > index ? data[6][index] : "",
        subCategory: "",
        subCategory_Es: "",
        color: "",
      });

      const query = { code: presentation.code };
      const options = { upsert: true };
      const updateDoc = {
        $set: presentation,
      };

      console.log(`Processing ${presentation.name}...`);
      await Presentation.updateOne(query, updateDoc, options);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  syncPresentations,
};
