const nanoid = require("nanoid");
const filehandler = require('./filehandler');

let list;

const refresh = () => {
    try {
        delete require.cache[require.resolve('./data/token.json')];
    } catch (e) {

    }
    try {
        list = new Map(require('./data/token.json'));
    } catch (e) {
        list = new Map();
    }
    return list;
};

const save = () => {
    filehandler.saveFile('token.json', JSON.stringify([...list]));
};

exports.get = () => refresh();


exports.generate = (name) => {
    refresh();
    let token = {};
    token.publicToken = nanoid();
    token.privateToken = nanoid();
    list.set(name, token);
    save();
    return token.publicToken;
};

exports.revoke = (name) => {
    refresh();
    if (list.has(name)) {
        list.delete(name);
        save();
        return true;
    } else {
        save();
        return false;
    }
};

exports.getNames = () => {
    refresh();
    list.keys();
};

exports.getTokens = () => {
    refresh();
    list.values();
};

exports.checkHasToken = (name) => {
    refresh();
    return list.has(name);
};

exports.doCheckPublicToken = (name, pub) => {
    refresh();
    if (exports.checkHasToken(name)) {
        return list.get(name).publicToken === pub;
    } else {
        return false;
    }
};

exports.getPublicToken = (name) => {
    refresh();
    if (exports.checkHasToken(name)) {
        return list.get(name).publicToken;
    } else {
        return null;
    }
};

exports.getPrivateToken = (name, pub) => {
    refresh();
    if (exports.doCheckPublicToken(name, pub)) {
        return list[name].privateToken;
    } else {
        return null;
    }
};

exports.resetTokenList = () => {
    list = new Map();
    save();
};