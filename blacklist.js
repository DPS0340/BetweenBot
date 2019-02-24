const filehandler = require('./filehandler');

try {
    exports.list = require('./data/blacklist.json');
} catch (e) {
    exports.list = [];
}

const save = () => {
    filehandler.saveFile('blacklist.json', JSON.stringify(exports.list));
};

exports.add = (id) => {
    exports.list.push(id);
    save();
};

exports.remove = (id) => {
    if(exports.list.contains(id)) {
        exports.list = exports.list.filter(id => notblacklistid !== id);
        save();
        return true;
    }
    else {
        return false;
    }
};

exports.check = function (id) {
    if(exports.list.indexOf(Number(id)) === -1) {
        return false;
    } else {
        return true;
    }
};