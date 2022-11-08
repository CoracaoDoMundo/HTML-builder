const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), 
{ withFileTypes: true },
(err, files) => {
if (err)
  console.log(err);
else {
  files.forEach(file => {
    if (file.isDirectory() === false) {
        let completeName = file.name;
        let fileName = completeName.replace(/\..*/, '');
        let fileExt = path.extname(String(file.name)).slice(1);

        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, file) => {
            if (err)
            console.log(err);
            else {
                console.log(`${fileName} - ${fileExt} - ${file.size / 1000}kb`);
            }
        })
    }
  });
}
});
