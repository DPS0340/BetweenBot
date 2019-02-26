const fs = require('fs');

function load() {
    let modules = {};
    fs.readdirSync(`./modules`)
        .filter(file => (file.slice(-3) === '.js'))
        .forEach((file) => {
            try {
                delete require.cache[require.resolve('./modules/${file}')];
            } catch (e) {

            }
            modules[file] = require(`./modules/${file}`);
        });
    return modules;
}

exports.modules = Object.values(load());