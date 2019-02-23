let Discord = require('discord.js');
const config = require('./botsetting.json');
const translate = require('@vitalets/google-translate-api');
const client = new Discord.Client();

let locale = 'ko';

function reply(msg, text) {
    translate(text, {to: locale})
        .then(function (res) {
            msg.reply(res.text);
        })
        .catch(err => {
            console.error(err);
        });
}

let prefix = '사이봇 ';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.startsWith(prefix)) {
        let command = msg.content.substring(prefix.length, msg.content.length);
        if (command === '핑') {
            msg.reply('**' + Math.round(client.ping) + 'ms!**:hearts:');
        }
        if (command.split(" ")[0] === '언어변경') {
            locale = command.split(" ")[1];
            console.log(locale);
            if(typeof locale === "undefined") {
                reply(msg, '인자가 없습니다!');
            }
            else {
                reply(msg, '언어 변경 완료!');
            }
        }
    }
});

client.login(config.token);
