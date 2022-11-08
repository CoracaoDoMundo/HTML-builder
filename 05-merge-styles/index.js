const path = require("path");
const fs = require("fs");

fs.stat(path.join(__dirname, "project-dist", "bundle.css"), function (err) {
  if (!err) {
    fs.truncate(path.join(__dirname, "project-dist", "bundle.css"), (err) => {
      if (err) throw err;
    });

    fs.readdir(
      path.join(__dirname, "styles"),
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            if (path.extname(String(file.name)) === ".css") {
              let input = fs.createReadStream(
                path.join(__dirname, "styles", `${file.name}`)
              );

              input.on("data", (data) => {
                fs.appendFile(
                  path.join(__dirname, "project-dist", "bundle.css"),
                  `${data}`,
                  (err) => {
                    if (err) throw err;
                  }
                );
              });
            }
          });
        }
      }
    );
  } else if (err.code === "ENOENT") {
    fs.writeFile(
      path.join(__dirname, "project-dist", "bundle.css"),
      "",
      (err) => {
        if (err) throw err;
      }
    );

    fs.readdir(
      path.join(__dirname, "styles"),
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            if (path.extname(String(file.name)) === ".css") {
              let input = fs.createReadStream(
                path.join(__dirname, "styles", `${file.name}`)
              );

              input.on("data", (data) => {
                fs.appendFile(
                  path.join(__dirname, "project-dist", "bundle.css"),
                  `${data}`,
                  (err) => {
                    if (err) throw err;
                  }
                );
              });
            }
          });
        }
      }
    );
  }
});
