const { google } = require("googleapis");
const sheets = {
  client_email: "sheets@jasu-345619.iam.gserviceaccount.com",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCONO9QnoZCynTc\n7YOk1pzwo2OLCGMsdAVYsppIyzyI1Om6n5lv7jNo1TPPxJLpHV0FsX579mPVycge\nfCHA03OMiep+dU7z50JHcrtIYXyELXtDBViw64jT65gRy2+CTMnS8tSR/+SdQHaj\n+RU/Z7kRmivij1gDKAnsGT/VvDcPz6PnbyG0s5GmpWufvKEAqa7qnYFPGRWkV36b\n4giJ7hvIfCTjlgsEt7Wj4Ay2jZplLlBEYX9uvj87UEQsLTgyl8K/thB6sNrND1lB\nivbvPdOQ6XcFlVHLJa3u69jN1bWeC77NG/BgkVONlVh2CEXjxO6cEpKnArWtEPUG\npZcVioaTAgMBAAECggEAAgC22iDRbUFisfXaY8jt/umeLkgY9XhQ1vX0/E94c8jj\n3c//njbxnGlcSHHRS90xATKFwIMw1sL3wY4n/4o612Dd35gRW5gHM/BmuNc+pLHr\nSX9ax2sZyzpHMwD1ehVQxlrLKZ87/gb5ZMfOR81TKu9L7O3t5GV89klIv97du6hA\nm9UkFjGQFGI1yAonmZRcI+qADJ3Yn1OnJxcEkR8uXLwfuk80He4Ja6jwzb/w5Zfm\nsfCX9t40OaT94j8pM50KkN5WmPjsRDAYjWSr3Z3LfOrV3EdhFwWqRVLTjz0BWRg9\nZsqtDgibIMx1V2/Z9GzPNvUXuUykyDjKWrGRjSk+aQKBgQC/pb+Us2V9FTnRRl8T\n15IBtdT56xFcMRPgUMlTC0DFKAbbk+GMAMoQCQR1P4hlu7vQPhALu1PMwJsIQnKI\nHyidt8vCs2MFUkL6PhU3UlLnKTUUBPCkFlE5OadCCCz+Kfu2D05NtBNAPD49aBxE\nyR46ZeJW/YB/q1xjzNbGW/IyNQKBgQC99TRtSy3Uynmzy+5ucppjoVRTfiFzySsT\n9rucxXkPpZfT3pALUhmmPmXdKtFwJTRK0PxUgkbrcuG97VKOBg2+KB18SctpAKk4\nDEX4qygwtvBbe3IY7paGL0ceGqaczKdVSHXBinjCxarUFIZiGilwUvK/kzfbWTDw\nx470lDVupwKBgA1lY5fcVlrA8hKrzZeQePc/o4x4nvUHxTDn1LrGTZe6bYhJtPlZ\nUMaAKtybPUiHL+Clhe+b/4aPbAbOxjy3mNo1b7vDWEeV8XKWhlsgmQTpf3lPwxZl\nLPZIDmXyNlrpylt2hG2wCaxyyZL3RQqV2FQSrRiRjbre2o1rUxP4d1yFAoGBAJ+F\nV62gwLA+CM4Qp/5gh367cJFdDsKpYV+2h/8zZmLZcRMfiF+5ZojRRcHhv1gqJive\nLMjbTqtTInfY4MccFlZmYbyKTCO1xmWnCOu28F1Yg6iPllWRpx6wfUyunNR4mN1p\nqFoL6zXFwZuwUNn5lmsZfXmcLAAseoj5TPffrq9pAoGBALTSP04G0IIG78bFGIl4\nYqRRRWy3XZnTeUMT7QzgPCuIpYNsrE2siG46+GoV69dtBIlG+u1/RFDUuh896KEf\nXICJDXa9ldA69QjF1uDE071xL9N76pO5jEHpezuHNGVg75b3IF/qsX3ZK4NCwxC7\nsvzwO91exEP2YedkPnahNhOv\n-----END PRIVATE KEY-----\n",
};

const googleSheets = async () => {
  const googleAuth = new google.auth.GoogleAuth({
    credentials: {
      client_email: sheets.client_email,
      private_key: sheets.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const googleClient = await googleAuth.getClient();
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: googleAuth,
  });

  return googleSheetsInstance;
};

const DriveImageToURL = (driveImage) => {
  if (!driveImage?.startsWith("https://drive.google.com/file/d/"))
    return driveImage;
  const trimmed = driveImage.replace("https://drive.google.com/file/d/", "");
  const id = trimmed.split("/")[0];
  return `https://drive.google.com/uc?export=view&id=${id}`;
};

const getSheetResponse = async (ranges, spreadsheetId, sheetName) => {
  try {
    const googleSheetsInstance = await googleSheets();
    const response = await googleSheetsInstance.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: Object.keys(ranges).map(
        (key) => `${sheetName}!${ranges[key]}2:${ranges[key]}`
      ),
      majorDimension: "COLUMNS",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "SERIAL_NUMBER",
    });

    const data = response.data.valueRanges.map((result) =>
      result?.values?.length ? result.values[0] : []
    );

    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { googleSheets, DriveImageToURL, getSheetResponse };
