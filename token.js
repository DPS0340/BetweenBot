const nanoid = require("nanoid");

exports.list = [];

exports.generate = () => {
    const token = nanoid();
    exports.list.push(token);
    return token;
};

exports.tempGenerate = () => {
    return nanoid();
};

exports.revoke = (token) => {
    if (exports.list.indexOf(token) !== -1) {
        exports.list = exports.list.filter(elem => token !== elem);
        return true;
    }
    else {
        return false;
    }
};