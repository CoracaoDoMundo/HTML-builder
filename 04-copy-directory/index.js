const path = require("path");
const fs = require("fs");

fs.stat(path.join(__dirname, "files-copy"), function (err) {

  const sourcePath = path.join(__dirname, "files");
  const finalPath = path.join(__dirname, "files-copy");

  if (!err) {
    fs.readdir(finalPath, (err, files) => {
      if (err) throw err;

      for (let file of files) {
        fs.unlink(path.join(__dirname, "files-copy", file), (err) => {
          if (err) throw err;
        });
      }
    });

    fs.readdir(sourcePath, (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          const input = fs.createReadStream(
            path.join(__dirname, "files", `${file}`)
          );
          const output = fs.createWriteStream(
            path.join(__dirname, "files-copy", `${file}`)
          );
          input.pipe(output);
        });
      }
    });
  } else if (err.code === "ENOENT") {
    fs.mkdir(finalPath, { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.readdir(sourcePath, (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          const input = fs.createReadStream(
            path.join(__dirname, "files", `${file}`)
          );
          const output = fs.createWriteStream(
            path.join(__dirname, "files-copy", `${file}`)
          );
          input.pipe(output);
        });
      }
    });
  }
});
