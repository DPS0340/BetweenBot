const fs = require('fs');

function load() {
    let modules = {};
    fs.readdirSync(`./modules`)
        .filter(file => (file.slice(-3) === '.js'))
        .forEach((file) => {
            modules[file] = require(`./modules/${file}`);
        });
    console.log(modules);
    return modules;
}

exports.modules = Object.values(load());