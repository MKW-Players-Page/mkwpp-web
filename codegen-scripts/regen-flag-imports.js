/*
    Write to /temp/flag-imports.txt the imports and map function to copy and paste.
*/

const fs = require("fs");

/*
    key: filename
    value: region code
*/
const renameScheme = {
  un: "world",
  eu: "eur",
  pc: "oce",
};
const flagFileNames = fs.readdirSync("src/assets/flags");

let out1 = ""; // imports
let out2 = ""; // Flags const
let out3 = ""; // map function

for (const flagFileName of flagFileNames) {
  const fileNameNoExt = flagFileName.split(".")[0];
  const renamed = renameScheme[fileNameNoExt] !== undefined;
  const code = renamed ? renameScheme[fileNameNoExt] : fileNameNoExt;
  out1 += `import { ReactComponent as Flag${code.toUpperCase()} } from "../../assets/flags/${flagFileName}";${renamed ? " // TODO: RENAMED!" : ""}\n`;
  out2 += `  ${code}: Flag${code.toUpperCase()},\n`;
  if (renamed) out3 += `    case "${code}":\n      return "${fileNameNoExt}";\n`;
}

if (!fs.existsSync("temp/")) fs.mkdirSync("temp");
fs.writeFileSync(
  "temp/flag-imports.txt",
  `import "./Flags.css";\n\n${out1}\nexport const Flags = {\n${out2}};\n\n/**\n * @param flag flag code that comes from the code field in region data\n * @returns the code used for the svg file instead\n */\nconst codeToFlag = (flag: string): string => {\n  switch (flag) {\n${out3}    default:\n      return flag;\n  }\n};`,
);
