const filehandler = require('../filehandler');

// send 번역
// 응용 TODO
function send(msg, text) {
    if(locale === 'ko') {
        msg.channel.send(text);
        return msg;
    } else {
        translate(text, {to: locale})
            .then(function (res) {
                msg.channel.send(res.text);
            })
            .catch(err => {
                console.error(err);
            });
        return msg;
    }
}

function translateAndSendMessage(msg, destLocale, text) {
    translate(text, {to: destLocale})
        .then(function (res) {
            msg.channel.send(res.text);
        })
        .catch(err => {
            console.error(err);
        });
    return msg;
}

module.exports = {
    '번역': (msg, command) => {
        let destLocale = args[1];
        let originalText = command.substring(command.indexOf(destLocale) + destLocale.length, command.length);
        translateAndSendMessage(msg, destLocale, originalText);
    },
    '언어변경': (msg, command) => {
        let newlocale = stringhandler.argsParse('언어변경', command)[0];
        console.log(locale);
        if (typeof newlocale === "undefined") {
            reply(msg, '지정한 언어가 없습니다!');
        } else {
            locale = newlocale;
            filehandler.saveFile('lang.txt', locale);
            reply(msg, '언어 변경 완료!');
        }
    },
};