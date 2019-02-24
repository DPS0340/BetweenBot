const nanoid = require("nanoid");
const filehandler = require('./filehandler');

try {
    exports.list = new Map(require('./data/token.json'));
} catch (e) {
    exports.list = new Map();
}

const save = () => {
    filehandler.saveFile('token.json', JSON.stringify([...exports.list]));
};

// exports.load = () =>  {
//     exports.list = new Map(JSON.parse(require('./data/token.json')));
//     return exports.list;
// };

exports.generate = (name) => {
    let token = {};
    token.publicToken = nanoid();
    token.privateToken = nanoid();
    exports.list.set(name, token);
    save();
    return token.publicToken;
};

exports.revoke = (name) => {
    if (exports.list.has(name)) {
        delete exports.list[name];
        save();
        return true;
    }
    else {
        save();
        return false;
    }
};

exports.getNames = () => exports.list.keys();

exports.getTokens = () => exports.list.values();

exports.checkHasToken = (name) => {
    return exports.list.has(name);
};

exports.doCheckPublicToken = (name, pub) => {
    if(exports.checkHasToken(name)) {
        return exports.list.get(name).publicToken === pub;
    } else {
        return false;
    }
};

exports.getPublicToken = (name) => {
    if(exports.checkHasToken(name)) {
        return exports.list.get(name).publicToken;
    }
    else {
        return null;
    }
};

exports.getPrivateToken = (name, pub) => {
    if(exports.doCheckPublicToken(name, pub)) {
        return exports.list[name].privateToken;
    }
    else {
        return null;
    }
};

exports.resetTokenList = () => {
    exports.list = new Map();
    save();
};