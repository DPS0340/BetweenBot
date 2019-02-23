const filehandler = require('./filehandler');

exports.list = require('./data/admins.json');

exports.save = function() {
    filehandler.saveFile('admins.json', JSON.stringify(exports.list));
};

exports.check = function (id) {
    if(exports.list.indexOf(Number(id)) === -1) {
        return false;
    } else {
        return true;
    }
};
