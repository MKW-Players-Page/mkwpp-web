// https://docs.google.com/spreadsheets/d/1mu2XyG_WQID0dYY0clTgRJAPg_oBb3BO5Z2Nb-VCDhg/edit?usp=sharing

const fs = require("fs");
const path = require("path");

const i18n = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "utils", "i18n", "i18n.json")),
);
let outStr = "key";
// presuming constantCupMUSHROOM will never be deleted
for (const langKey in i18n.constantCupMUSHROOM) {
  outStr += "\t";
  outStr += langKey;
}
outStr += "\n";

for (const key in i18n) {
  outStr += key;
  for (const lang in i18n[key]) {
    outStr += "\t";
    outStr += i18n[key][lang];
  }
  outStr += "\n";
}

if (!fs.existsSync("temp/")) fs.mkdirSync("temp");
fs.writeFileSync("temp/i18n.tsv", outStr);
