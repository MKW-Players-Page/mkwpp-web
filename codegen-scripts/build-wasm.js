const childProc = require("child_process");
const path = require("path");
const fs = require("fs");

childProc.exec("command -v wasm-pack", (err, stdout, stderr) => {
  if (err) {
    console.log("You should install wasm-pack with:");
    console.log("cargo install wasm-pack");
    process.exit(0);
  }
  process.chdir(path.join(__dirname, "..", "wasm", "rust", "mkw_lib"));
  childProc.exec(`cargo fmt`);
  childProc.exec(`wasm-pack build --release --target web`, (err, stdout, stderr) => {
    if (err) {
      console.log("Compilation didn't run. Error.");
      process.exit(0);
    }
    console.log(stdout);
    console.log(stderr);

    fs.unlinkSync(path.join(__dirname, "..", "wasm", "rust", "mkw_lib", "pkg", ".gitignore"));
    fs.readdirSync(path.join(__dirname, "..", "wasm", "rust", "mkw_lib", "pkg"))
      .filter((r) => r.endsWith(".ts") || r.endsWith(".js"))
      .forEach((fileName) => {
        const filePath = path.join(__dirname, "..", "wasm", "rust", "mkw_lib", "pkg", fileName);
        const file = fs.readFileSync(filePath);
        if (!file.toString().startsWith("/* tslint:disable */\n/* eslint-disable */\n")) {
          const fd = fs.openSync(filePath, "w+");
          const insert = Buffer.from("/* tslint:disable */\n/* eslint-disable */\n");
          fs.writeSync(fd, insert, 0, insert.length, 0);
          fs.writeSync(fd, file, 0, file.length, insert.length);
          fs.close(fd, (err) => {
            if (err) throw err;
          });
        }
      });
  });
});
