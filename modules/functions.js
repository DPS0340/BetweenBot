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
      '트위': (msg, command) => {    
    const api = `https://api.twitch.tv/kraken/channels/sirusiru1818?client_id=h5otvowaukebe06barer212ljrbz9n`;
    snekfetch.get(api).then(r => {
        let embed = new Discord.RichEmbed()
            .setAuthor(
                `${r.body.display_name}`,
                `${r.body.logo}`,
                `${r.body.url}`
            )
            .setColor(config.color)
            .setThumbnail(`http://static-cdn.jtvnw.net/ttv-boxart/${encodeURI(r.body.game)}-500x500.jpg`)
            .addField('방송 제목', `${r.body.status}`, true)
            .addField('게임 중', `${r.body.game}`, true)
            .addField('팔로우 수', `${r.body.followers}`, true)
            .addField('조회수', `${r.body.views}`, true)
            .setImage(r.body.video_banner)

        msg.channel.send(embed);
    })
   },
};
