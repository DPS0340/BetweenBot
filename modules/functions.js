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
    '개': (msg, command) => {
        let url = `http://random.dog/woof.json`;
        request(url, function (err, response, body) {
            if (err) {
                console.log(`에러발생 \n\n \`\`\`js\n${err}\n\`\`\`\n\n`);
                return;
            }
            body = JSON.parse(body);
            if (body.url) {
                let embed = new Discord.RichEmbed()
                    .setColor(`${config.color}`)
                    .setTimestamp()
                    .setImage(body.url);
                msg.channel.send(embed);
            }
        })
    },
    '네코': (msg, command) => {
        let url = `https://nekos.life/api/v2/img/neko`;
        request(url, function (err, response, body) {
            if (err) {
                console.log(`에러발생 \n\n \`\`\`js\n${err}\n\`\`\`\n\n`);
                return;
            }
            body = JSON.parse(body);
            if (body.url) {
                let embed = new Discord.RichEmbed()
                    .setColor(`${config.color}`)
                    .setTimestamp()
                    .setImage(body.url);
                msg.channel.send(embed);
            }
        })
    },
};
