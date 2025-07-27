/*
    Write to /temp/flag-imports.txt the imports and map function to copy and paste.
*/

const fs = require("fs");

/*
    key: filename
    value: region code
*/

const flagFileNames = fs.readdirSync("src/assets/flags");

let out1 = ""; // imports
let out2 = ""; // Flags const

for (const flagFileName of flagFileNames) {
  const fileNameNoExt = flagFileName.split(".")[0];
  out1 += `import { ReactComponent as Flag${fileNameNoExt.toUpperCase()} } from "../../assets/flags/${flagFileName}";\n`;
  out2 += `  ${fileNameNoExt}: Flag${fileNameNoExt.toUpperCase()},\n`;
}

if (!fs.existsSync("temp/")) fs.mkdirSync("temp");
fs.writeFileSync(
  "temp/flag-imports.txt",
  `import "./Flags.css";\n\n${out1}\nexport const Flags = {\n${out2}};\n`,
);
