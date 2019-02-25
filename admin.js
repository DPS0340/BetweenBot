const filehandler = require('./filehandler');

try {
    delete require.cache[require.resolve('./data/admins.json')];
} catch (e) {

}
try {
    exports.list = require('./data/admins.json');
} catch (e) {
    exports.list = [];
}


const save = function() {
    filehandler.saveFile('admins.json', JSON.stringify(exports.list));
};

exports.check = function (id) {
    return exports.list.includes(Number(id));
};