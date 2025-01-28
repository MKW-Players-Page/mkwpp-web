const fs = require("fs");
const path = require("path");

const i18n = new Set(
  Object.keys(
    JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "utils", "i18n", "i18n.json"))),
  ).filter((r) => !r.startsWith("constant")),
);

const excludeRegex = [
  /.*\.d\.ts/g,
  /reportWebVitals\.ts/,
  /setupTests\.ts/,
  /flags/,
  /generated/,
  /i18n.json/,
];

async function walk(dir) {
  const dirRead = fs.readdirSync(dir);
  for (const item of dirRead) {
    if (excludeRegex.map((regex) => regex.test(item)).includes(true)) continue;
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      await walk(itemPath);
    } else if (stats.isFile()) {
      const fileRead = fs.readFileSync(itemPath).toString();
      const remove = [];
      for (const i18nKey of i18n) if (fileRead.includes(i18nKey)) remove.push(i18nKey);
      for (const i18nKey of remove) i18n.delete(i18nKey);
    }
  }
}

walk(path.join(__dirname, "..", "src")).then(() => {
  console.log("Keys that have no use:", i18n);
});
