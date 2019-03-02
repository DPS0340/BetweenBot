const Discord = require('discord.js');
const stringhandler = require('../stringhandler');
const snekfetch = require('snekfetch');

module.exports = {
    '유튜브': (msg, command) => {
        let youtube = stringhandler.cutTextHead('유튜브', command);
        let link = `https://www.youtube.com/results?search_query=` + youtube;
        if (!youtube) return message.reply(`Please enter a keyword.`);
        if (!link) return message.reply("Please enter a keyword, no a link.");
        let embed = new Discord.RichEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField('Action:', 'Searching on youtube')
            .addField("Word:", youtube)
            .addField('Link:', link)
            .setFooter("Your avatar", message.author.avatarURL);
        msg.channel.send(embed);
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
            let nike = stringhandler.argsParse('트위 ', command)[0];
    const api = `https://api.twitch.tv/kraken/channels/${nike}?client_id=h5otvowaukebe06barer212ljrbz9n`;
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
}
