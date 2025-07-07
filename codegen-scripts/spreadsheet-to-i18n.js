import fetch from "node-fetch";
import fs from "fs";

// If something breaks it's probably this
const url =
  "https://docs.google.com/spreadsheets/u/0/d/1mu2XyG_WQID0dYY0clTgRJAPg_oBb3BO5Z2Nb-VCDhg/export?format=tsv&id=1mu2XyG_WQID0dYY0clTgRJAPg_oBb3BO5Z2Nb-VCDhg&gid=885942043";

fetch(url)
  .then((r) => r.text())
  .then((tsv) => {
    let outJson = {};
    const lines = tsv.split("\r\n");
    const columnsHeading = lines[0].split("\t");
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const columns = line.split("\t");
      let outObj = {};
      let key = "";
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        if (columnsHeading[columnIndex] === "key") {
          key = columns[columnIndex];
        } else {
          outObj[columnsHeading[columnIndex]] = columns[columnIndex];
        }
      }
      outJson[key] = outObj;
    }
    if (!fs.existsSync("temp/")) fs.mkdirSync("temp");
    fs.writeFileSync("temp/i18n.json", JSON.stringify(outJson));
  });
