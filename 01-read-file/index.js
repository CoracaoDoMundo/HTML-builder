const path = require('path');
const fs = require('fs');
const {stdout} = require('process');

const text = fs.createReadStream(path.join(__dirname, 'text.txt'));
text.on('data', data => {
stdout.write(data)
//   console.log(`${text.read()}`);
// });
// text.on('end', () => {
});
