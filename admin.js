const filehandler = require('./filehandler');

exports.list = filehandler.readFile('admins.json');

exports.save = function() {
    filehandler.saveFile('admins.json', exports.list);
};

exports.check = function (id) {
    if(typeof exports.list.find(id) === "undefined") {
        return false;
    } else {
        return true;
    }
};