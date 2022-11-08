const path = require("path");
const fs = require("fs");

fs.stat(path.join(__dirname, "files-copy"), function (err) {
  if (!err) {
    fs.readdir(path.join(__dirname, "files-copy"), (err, files) => {
      if (err) throw err;

      for (let file of files) {
        fs.unlink(path.join(__dirname, "files-copy", file), (err) => {
          if (err) throw err;
        });
      }
    });

    fs.readdir(path.join(__dirname, "files"), (err, files) => {
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
    fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.readdir(path.join(__dirname, "files"), (err, files) => {
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
