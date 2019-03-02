const translate = require('@vitalets/google-translate-api');
const filehandler = require('../filehandler');
const request = require('request');
const config = require('../botsetting.json');

let locale = filehandler.readFile('lang.txt');

// reply 번역
function reply(msg, text) {
    if(locale === 'ko') {
        msg.reply(text);
        return msg;
    } else {
        translate(text, {to: locale})
            .then(function (res) {
                msg.reply(res.text);
            })
            .catch(err => {
                console.error(err);
            });
        return msg;
    }
}

module.exports = {
    '헬로': (msg, command) => {
        msg.channel.send("헬로!");
    },
};
