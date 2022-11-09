const path = require("path");
const fs = require("fs");
// const { arrayBuffer } = require("stream/consumers");

fs.stat(path.join(__dirname, "project-dist"), function (err) {
  if (!err) {
    fs.readdir(path.join(__dirname, "project-dist"), (err, files) => {
      if (err) throw err;

      // Очищаем папку

      for (let file of files) {
        fs.unlink(path.join(__dirname, "project-dist", file), (err) => {
          if (err) throw err;
        });
      }
    });

    // Читаем шаблон

    let template = fs.createReadStream(path.join(__dirname, "template.html"));

    template.on("data", (data) => {
      // Создаем html файл, копию шаблона

      fs.writeFile(
        path.join(__dirname, "project-dist", "index.html"),
        `${data}`,
        (err) => {
          if (err) throw err;
        }
      );

      // Заменяем компоненты в новом файле html

      fs.readdir(
        path.join(__dirname, "components"),
        { withFileTypes: true },
        (err, files) => {
          if (err) console.log(err);
          else {
            let arr = files.filter(
              (file) => path.extname(String(file.name)) === ".html"
            );

            arr = arr.map(
              (file) => (file = `\{\{${file.name.replace(/\..*/, "")}\}\}`)
            );

            fs.readFile(
              path.join(__dirname, "project-dist", "index.html"),
              "utf-8",
              function (err, data) {
                if (err) throw err;

                for (let i = 0; i < arr.length; i++) {
                  let newData = fs.createReadStream(
                    path.join(
                      __dirname,
                      "components",
                      `${arr[i].replace(/[^a-zа-яё\s]/gi, "")}.html`
                    ),
                    "utf-8",
                    function (err, newText) {
                      if (err) throw err;
                    }
                  );

                  newData.on("data", (newText) => {
                    data = data.replace(arr[i], newText);
                    fs.writeFile(
                      path.join(__dirname, "project-dist", "index.html"),
                      data,
                      function (err, data) {
                        if (err) throw err;
                      }
                    );
                  });
                }
              }
            );
          }
        }
      );
    });

    // Собираем файл css

    fs.truncate(path.join(__dirname, "project-dist", "style.css"), (err) => {
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
                    path.join(__dirname, "project-dist", "style.css"),
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

    // Копируем папку assets

    


  } else if (err.code === "ENOENT") {
    fs.mkdir(
      path.join(__dirname, "project-dist"),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    // Читаем шаблон

    let template = fs.createReadStream(path.join(__dirname, "template.html"));

    template.on("data", (data) => {
      // Создаем html файл, копию шаблона

      fs.writeFile(
        path.join(__dirname, "project-dist", "index.html"),
        `${data}`,
        (err) => {
          if (err) throw err;
        }
      );

      // Заменяем компоненты в новом файле html

      fs.readdir(
        path.join(__dirname, "components"),
        { withFileTypes: true },
        (err, files) => {
          if (err) console.log(err);
          else {
            let arr = files.filter(
              (file) => path.extname(String(file.name)) === ".html"
            );

            arr = arr.map(
              (file) => (file = `\{\{${file.name.replace(/\..*/, "")}\}\}`)
            );

            fs.readFile(
              path.join(__dirname, "project-dist", "index.html"),
              "utf-8",
              function (err, data) {
                if (err) throw err;

                for (let i = 0; i < arr.length; i++) {
                  let newData = fs.createReadStream(
                    path.join(
                      __dirname,
                      "components",
                      `${arr[i].replace(/[^a-zа-яё\s]/gi, "")}.html`
                    ),
                    "utf-8",
                    function (err, newText) {
                      if (err) throw err;
                    }
                  );

                  newData.on("data", (newText) => {
                    data = data.replace(arr[i], newText);
                    fs.writeFile(
                      path.join(__dirname, "project-dist", "index.html"),
                      data,
                      function (err, data) {
                        if (err) throw err;
                      }
                    );
                  });
                }
              }
            );
          }
        }
      );
    });

    // Собираем файл css

    fs.writeFile(
        path.join(__dirname, "project-dist", "style.css"),
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
                    path.join(__dirname, "project-dist", "style.css"),
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

      // Копируем папку assets


  }
});
