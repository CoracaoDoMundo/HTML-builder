const path = require('path');
const fs = require('fs');
const {stdin, stdout} = require('process');

stdout.write('Пожалуйста, введите любой текст на ваш выбор.\n');
fs.writeFile(
    path.join(__dirname, 'text.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

stdin.on('data', data => {
    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        data,
        err => {
            if (err) throw err;
        }
        
    );
  });

  process.on('SIGINT', () => {
    console.log('\nСпасибо за Ваш вклад. Всего доброго!')
    process.exit();
  });

  stdin.on('data', data => {
    if (data.toString('utf8').trim() === 'exit') {
        console.log('Спасибо за Ваш вклад. Всего доброго!')
        process.exit();
    }
  });
