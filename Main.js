let Discord = require('discord.js');
const config = require('./botsetting.json');
const translate = require('@vitalets/google-translate-api');
const filehandler = require('./filehandler');
const admin = require('./admin');
const blacklist = require('./blacklist');
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
    return msg;
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;
    if (msg.content.startsWith(config.prefix)) {
        if (blacklist.check((msg.author.id))) {
            reply(msg, '당신은 이 봇을 쓸 수 없습니다!');
            return;
        }
        let command = msg.content.substring(config.prefix.length, msg.content.length);
        let args = command.split(" ");
        if (command === '핑') {
            msg.reply('**' + Math.round(client.ping) + 'ms!**');
        }
        if (command.split(" ")[0] === '언어변경') {
            locale = command.split(" ")[1];
            console.log(locale);
            if (typeof locale === "undefined") {
                reply(msg, '지정한 언어가 없습니다!');
            } else {
                reply(msg, '언어 변경 완료!');
            }
        }
        if (command === '데이터 리스트') {
            if (admin.check(msg.author.id)) {
                let files = filehandler.getFileList();
                for (let file of files) {
                    msg.reply(file);
                }
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '어드민') {
            if (admin.check(msg.author.id)) {
                reply(msg, '당신은 어드민입니다!');
            } else {
                reply(msg, '당신은 어드민이 아닙니다!');
            }
        }
        if (command === "help") {
            reply(msg, '아직 개발 ');
        }
        if (command.startsWith('블랙리스트 추가')) {
            if (admin.check(msg.author.id)) {
                let blacklistid = command.split(" ")[2];
                blacklist.list.push(blacklistid);
                blacklist.save();
                reply(msg, blacklistid + '님은 이제 더이상 봇을 이용하실 수 없습니다.');
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command.startsWith('블랙리스트 해제')) {
            if (admin.check(msg.author.id)) {
                let notblacklistid = command.split(" ")[2];
                blacklist.list = blacklist.list.filter(id => notblacklistid !== id);
                blacklist.save();
                msg.channel.send(notblacklistid + '님은 이제 다시 봇을 이용가능합니다!'); // 번역 TODO 인 것
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '블랙리스트') {
            if (admin.check(msg.author.id)) {
                msg.reply(msg);
                for (let id of blacklist.list) {
                    msg.channel.send(id);
                }
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command.startsWith('밴')) {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                reply(msg, '권한이 없습니다!');
                return;
            }
            if (args[1] === "help") {
                reply(msg, `: ${config.prefix}밴 유저맨션 사유`);
                return;
            }
            let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
            if (!bUser) return errors.cantfindUser(msg.channel);
            if (bUser.id === client.user.id) return errors.botuser(msg);
            let bReason = args.join(" ").slice(22);
            if (!bReason) return errors.noReason(msg.channel);

            let banEmbed = new Discord.RichEmbed()
                .setDescription("밴")
                .setColor(`${config.color}`)
                .addField("밴 유저", `${bUser} 와 아이디 ${bUser.id}`)
                .addField("밴한 유저", `<@${msg.author.id}> 와 아이디 ${msg.author.id}`)
                .addField("밴된 채널", msg.channel)
                .addField("시간", msg.createdAt)
                .addField("사유", bReason);

            reply(msg, bUser.tag);
            msg.guild.ban(bUser);
            msg.channel.send(banEmbed);
        }
        if (command.startsWith('clear')) {
            if (!args[1]) return msg.reply("숫자를 써주세요");
            msg.channel.bulkDelete(args[1] + 1).then(() => {
                reply(msg, `메세지 ${args[1]} 만큼 삭제했습니다.`);
            });
        }
        if (command.startsWith('언밴')) {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                reply(msg, '권한이 없습니다!');
                return;
            }
            if (args[1] === "help") {
                reply(msg, `: ${config.prefix}언밴 유저맨션 사유`);
                return;
            }
            let unbUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
            if (!unbUser) return errors.cantfindUser(msg.channel);
            if (unbUser.id === client.user.id) return errors.botuser(msg);
            let unbReason = args.join(" ").slice(22);
            if (!unbReason) return errors.noReason(msg.channel);
            let unbanEmbed = new Discord.RichEmbed()
                .setDescription("언밴")
                .setColor(`${config.color}`)
                .addField("언밴 유저", `${unbUser} 와 아이디 ${unbUser.id}`)
                .addField("언밴한 유저", `<@${msg.author.id}> 와 아이디 ${msg.author.id}`)
                .addField("시간", msg.createdAt)
                .addField("사유", unbReason);
            msg.guild.unban(unbUser);
            reply(msg, unbanEmbed);
        }
        if (command.startsWith('userinfo')) {
            let embed = new Discord.RichEmbed()
                .setAuthor(`User Information`)
                .setColor('#1e90ff')
                .setAuthor(msg.author.username)
                .setDescription(`${msg.author.username}님의 정보입니다!`)
                .setThumbnail(msg.author.displayAvatarURL)
                .addField('Name:', `${msg.author.tag}`)
                .addField('ID:', `${msg.author.id}`)
                .addField('Creation date:', msg.author.createdAt);
            msg.channel.send(embed);
        }

        if (command === 'serverinfo') {
            let sicon = msg.guild.iconURL;
            let serverembed = new Discord.RichEmbed()
                .setDescription("Server Information")
                .setColor("#1e90ff")
                .setThumbnail(sicon)
                .addField("Server Name", msg.guild.name)
                .addField("Created On", msg.guild.createdAt)
                .addField("You Joined", msg.member.joinedAt)
                .addField("Total Members", msg.guild.memberCount)
                .addField("Roles", msg.guild.roles.reduce((role, result) => result += role + ' '))
                .addField("Owner", msg.guild.owner)
                .addField("Channel", msg.guild.channels.size)
                .addField("ID", msg.guild.id);
            msg.channel.send(serverembed);
        }
    }
});

client.login(config.token);
