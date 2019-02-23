let Discord = require('discord.js');
const config = require('./botsetting.json');
const translate = require('@vitalets/google-translate-api');
const filehandler = require('./filehandler');
const admin = require('./admin');
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



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.startsWith(config.prefix)) {
        let command = msg.content.substring(config.prefix.length, msg.content.length);
        if (command === '핑') {
            msg.reply('**' + Math.round(client.ping) + 'ms!**');
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
        if(command === '데이터 리스트') {
            if(admin.check(msg.author.id)) {
                let files = filehandler.getFileList();
                for (let file of files) {
                    msg.reply(file);
                }
            }
            else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if(command === '어드민') {
            if(admin.check(msg.author.id)) {
                reply(msg, '당신은 어드민입니다!');
            }
            else {
                reply(msg, '당신은 어드민이 아닙니다!');
            }
        }
    }
});

client.login(config.token);
