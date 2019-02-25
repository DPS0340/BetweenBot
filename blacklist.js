const filehandler = require('./filehandler');

let list;
const refresh = () => {
    try {
        delete require.cache[require.resolve('./data/blacklist.json')];
    } catch (e) {

    }
    try {
        list = require('./data/blacklist.json');
    } catch (e) {
        list = [];
    }
    return list;
};

exports.get = () => refresh();


const save = () => {
    filehandler.saveFile('blacklist.json', JSON.stringify(exports.list));
};

exports.add = (id) => {
    refresh();
    list.push(Number(id));
    save();
};

exports.remove = (id) => {
    refresh();
    id = Number(id);
    if (list.contains(id)) {
        list = list.filter(guessNotBlackList => guessNotBlackList !== id);
        save();
        return true;
    }
    else {
        return false;
    }
};

exports.check = function (id) {
    refresh();
    list.includes(Number(id));
};