const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;

// Создание папки assets

function createFolder() {
  return new Promise((resolve) => {
    fs.stat(path.join(__dirname, 'project-dist', 'assets'), function (err) {
      if (!err) {
        resolve();
      } else if (err.code === 'ENOENT') {
        fs.mkdir(
          path.join(__dirname, 'project-dist', 'assets'),
          { recursive: true },
          (err) => {
            if (err) throw err;
            else resolve();
          }
        );
      } else {
        throw err;
      }
    });
  });
}

// Удаление старой папки assets, если она существует

function deleteFolder() {
  return new Promise((resolve) => {
    fs.rm(
      path.join(__dirname, 'project-dist', 'assets'),
      { recursive: true, force: true },
      (err) => {
        if (err) throw err;
        else resolve();
      }
    );
  });
}

// Копирование папки assets

function copyFolder() {
  return new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const sourcePath = path.join(__dirname, 'assets', file);
        const finalPath = path.join(
          __dirname,
          'project-dist',
          'assets',
          file
        );

        fs.stat(sourcePath, (err, stats) => {
          if (err) throw err;

          if (stats.isFile()) {
            const input = fs.createReadStream(sourcePath);
            const output = fs.createWriteStream(finalPath);

            input.pipe(output);
          } else {
            fs.mkdir(finalPath, { recursive: true }, (err) => {
              if (err) throw err;

              fs.readdir(sourcePath, (err, innerFiles) => {
                if (err) throw err;

                innerFiles.forEach((innerFile) => {
                  const input = fs.createReadStream(
                    path.join(sourcePath, innerFile)
                  );
                  const output = fs.createWriteStream(
                    path.join(finalPath, innerFile)
                  );

                  input.pipe(output);
                });
              });
            });
          }
        });
      });
      resolve();
    });
  });
}

// Общая фукнция на создание и обновление директории

fs.stat(path.join(__dirname, 'project-dist'), function (err) {
  if (!err) {
    fs.readdir(path.join(__dirname, 'project-dist'), (err, files) => {
      if (err) throw err;

      // Очищаем папку

      for (let file of files) {
        fs.stat(
          path.join(__dirname, 'project-dist', `${file}`),
          function (err, stats) {
            if (err) throw err;
            if (stats.isFile()) {
              fs.unlink(
                path.join(__dirname, 'project-dist', `${file}`),
                (err) => {
                  if (err) throw err;
                }
              );
            } else {
              fs.readdir(
                path.join(__dirname, 'project-dist', `${file}`),
                (err, innerFiles) => {
                  if (err) throw err;

                  for (let el of innerFiles) {
                    fs.stat(
                      path.join(__dirname, 'project-dist', `${file}`, `${el}`),
                      function (err, stats) {
                        if (err) throw err;
                        if (stats.isFile()) {
                          fs.unlink(
                            path.join(
                              __dirname,
                              'project-dist',
                              `${file}`,
                              `${el}`
                            ),
                            (err) => {
                              if (err) throw err;
                            }
                          );

                          fs.rmdir(
                            path.join(__dirname, 'project-dist', `${file}`),
                            (err) => {
                              if (err) throw err;
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
    // Читаем шаблон

    let template = fs.createReadStream(path.join(__dirname, 'template.html'));

    template.on('data', (data) => {
      // Создаем html файл, копию шаблона

      fs.writeFile(
        path.join(__dirname, 'project-dist', 'index.html'),
        `${data}`,
        (err) => {
          if (err) throw err;
        }
      );

      // Заменяем компоненты в новом файле html

      fs.readdir(
        path.join(__dirname, 'components'),
        { withFileTypes: true },
        (err, files) => {
          if (err) console.log(err);
          else {
            let arr = files.filter(
              (file) => path.extname(String(file.name)) === '.html'
            );

            arr = arr.map(
              (file) => (file = `\{\{${file.name.replace(/\..*/, '')}\}\}`)
            );

            fs.readFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              'utf-8',
              function (err, data) {
                if (err) throw err;

                for (let i = 0; i < arr.length; i++) {
                  let newData = fs.createReadStream(
                    path.join(
                      __dirname,
                      'components',
                      `${arr[i].replace(/[^a-zа-яё\s]/gi, '')}.html`
                    ),
                    'utf-8',
                    function (err) {
                      if (err) throw err;
                    }
                  );

                  newData.on('data', (newText) => {
                    data = data.replace(arr[i], newText);
                    fs.writeFile(
                      path.join(__dirname, 'project-dist', 'index.html'),
                      data,
                      function (err) {
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

    fs.truncate(path.join(__dirname, 'project-dist', 'style.css'), (err) => {
      if (err) throw err;
    });

    fs.readdir(
      path.join(__dirname, 'styles'),
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            if (path.extname(String(file.name)) === '.css') {
              let input = fs.createReadStream(
                path.join(__dirname, 'styles', `${file.name}`)
              );

              input.on('data', (data) => {
                fs.appendFile(
                  path.join(__dirname, 'project-dist', 'style.css'),
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

    createFolder()
      .then(deleteFolder)
      .then(copyFolder)
      .catch((err) => console.error(err));

  } else if (err.code === 'ENOENT') {
    fs.mkdir(
      path.join(__dirname, 'project-dist'),
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    // Читаем шаблон

    let template = fs.createReadStream(path.join(__dirname, 'template.html'));

    template.on('data', (data) => {
      // Создаем html файл, копию шаблона

      fs.writeFile(
        path.join(__dirname, 'project-dist', 'index.html'),
        `${data}`,
        (err) => {
          if (err) throw err;
        }
      );

      // Заменяем компоненты в новом файле html

      fs.readdir(
        path.join(__dirname, 'components'),
        { withFileTypes: true },
        (err, files) => {
          if (err) console.log(err);
          else {
            let arr = files.filter(
              (file) => path.extname(String(file.name)) === '.html'
            );

            arr = arr.map(
              (file) => (file = `\{\{${file.name.replace(/\..*/, '')}\}\}`)
            );

            fs.readFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              'utf-8',
              function (err, data) {
                if (err) throw err;

                for (let i = 0; i < arr.length; i++) {
                  let newData = fs.createReadStream(
                    path.join(
                      __dirname,
                      'components',
                      `${arr[i].replace(/[^a-zа-яё\s]/gi, '')}.html`
                    ),
                    'utf-8',
                    function (err, newText) {
                      if (err) throw err;
                    }
                  );

                  newData.on('data', (newText) => {
                    data = data.replace(arr[i], newText);
                    fs.writeFile(
                      path.join(__dirname, 'project-dist', 'index.html'),
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
      path.join(__dirname, 'project-dist', 'style.css'),
      '',
      (err) => {
        if (err) throw err;
      }
    );

    fs.readdir(
      path.join(__dirname, 'styles'),
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            if (path.extname(String(file.name)) === '.css') {
              let input = fs.createReadStream(
                path.join(__dirname, 'styles', `${file.name}`)
              );

              input.on('data', (data) => {
                fs.appendFile(
                  path.join(__dirname, 'project-dist', 'style.css'),
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

    createFolder()
    .then(copyFolder)
    .catch((err) => console.error(err));

  }
});
