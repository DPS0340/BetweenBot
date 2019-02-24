const filehandler = require('./filehandler');

try {
    exports.list = require('./data/blacklist.json');
} catch (e) {
    exports.list = [];
}

exports.save = function() {
    filehandler.saveFile('blacklist.json', JSON.stringify(exports.list));
};

exports.check = function (id) {
    if(exports.list.indexOf(Number(id)) === -1) {
        return false;
    } else {
        return true;
    }
};