const nanoid = require("nanoid");

exports.list = {};

exports.generate = (name) => {
    const token = nanoid();
    exports.list.set(name, token);
    return token;
};

exports.tempGenerate = () => {
    return nanoid();
};

exports.revoke = (name) => {
    if (exports.list.keys().includes(name)) {
        delete exports.list[name];
        return true;
    }
    else {
        return false;
    }
};

exports.getNames = () => exports.list.keys();

exports.getTokens = () => exports.list.values();

exports.checkToken = (token) => {
    return exports.list.includes(token);
};