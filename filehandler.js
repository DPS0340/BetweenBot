const fs = require('fs');

exports.path = "data/";

exports.saveFile = function(fileName, data, writetype) {
    let type;

    if(typeof writetype === "undefined") {
        type = 'utf8';
    } else {
        type = writetype;
    }

    if(fileName.indexOf("..") === -1) {
        fs.writeFile(exports.path + fileName, data, type, function(err) {
            console.log(fileName + " 쓰기 완료!");
        });
    }
};

exports.readFile = function(fileName, readtype) {
    let type;

    if(typeof readtype === "undefined") {
        type = 'utf8';
    } else {
        type = readtype;
    }
    if(fileName.indexOf("..") === -1) {
        return fs.readFileSync(exports.path + fileName, type)
    }
};

exports.getFileList = function() {
    let files = [];
    fs.readdirSync(exports.path).forEach(file => {
        files.push(file);
    });
    return files;
};