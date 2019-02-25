let Discord = require('discord.js');
const config = require('./botsetting.json');
const translate = require('@vitalets/google-translate-api');
const filehandler = require('./filehandler');
const admin = require('./admin');
const blacklist = require('./blacklist');
const client = new Discord.Client();
const web = require('./BetweenBot-Web/app');
const token = require('./token');

const webapp = web.app;

web.run();

let locale = 'ko';

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


client.on('ready', () => {
    console.log('사이봇 실행중!');
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
        if (command.startsWith('언어변경')) {
            let newlocale = args[1];
            console.log(locale);
            if (typeof newlocale === "undefined") {
                reply(msg, '지정한 언어가 없습니다!');
            } else {
                locale = newlocale;
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
                blacklist.add(blacklistid);
                reply(msg, blacklistid + '님은 이제 더이상 봇을 이용하실 수 없습니다.');
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command.startsWith('블랙리스트 해제')) {
            if (admin.check(msg.author.id)) {
                let notblacklistid = command.split(" ")[2];
                blacklist.remove(id);
                msg.channel.send(notblacklistid + '님은 이제 다시 봇을 이용가능합니다!');
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '블랙리스트') {
            if (admin.check(msg.author.id)) {
                msg.reply(msg, '블랙리스트 목록:');
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
                reply(msg, `: ${config.prefix}밴 유저멘션 사유`);
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
            function senduserinfo(user) {
                embed.setAuthor(`User Information`)
                    .setColor('#1e90ff')
                    .setAuthor(user.username)
                    .setDescription(`${user.username}님의 정보입니다!`)
                    .setThumbnail(user.displayAvatarURL)
                    .addField('Name:', `${user.tag}`)
                    .addField('ID:', `${user.id}`)
                    .addField('Creation date:', user.createdAt);
                msg.channel.send(embed);
            }
            let embed = new Discord.RichEmbed();
            if (args.length === 1) {
                let user = msg.author;
                senduserinfo(user);
            } else if (args.length === 2) {
                let user = msg.mentions.users.first();
                senduserinfo(user);
            } else {
                msg.channel.send("인자가 너무 많습니다.");
                return;
            }

        }
        if (command === 'serverinfo') {
            let serverembed = new Discord.RichEmbed()
                .setDescription("Server Information")
                .setColor("#1e90ff")
                .setThumbnail(msg.guild.iconURL)
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
        if (command === '웹토큰 발급') {
            if (admin.check(msg.author.id)) {
                if(token.checkHasToken(msg.author.tag)) {
                    token.revoke(msg.author.tag);
                    reply(msg, '이미 발급된 토큰이 있습니다!');
                    msg.channel.send('기존 토큰을 리보크하고 새 토큰을 발급합니다!');
                } else {
                    reply(msg, '신규 토큰을 발급합니다!');
                }
                msg.channel.send(token.generate(msg.author.tag));
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '웹토큰 리보크') {
            if (admin.check(msg.author.id)) {
                token.revoke(msg.author.tag);
                reply(msg, "토큰 리보크 완료!");
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '웹토큰 확인') {
            if (admin.check(msg.author.id)) {
                if(token.checkHasToken(msg.author.tag)) {
                    reply(msg, "이 토큰은 유효합니다!");
                } else {
                    reply(msg, "이 토큰은 유효하지 않습니다!");
                }
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '웹토큰 초기화') {
            if (admin.check(msg.author.id)) {
                token.resetTokenList();
                reply(msg, "토큰 초기화 완료!");
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '웹토큰 리스트') {
            if (admin.check(msg.author.id)) {
                for (let [name, aToken] of token.get()) {
                    msg.channel.send(name + " 님의 토큰은 " + aToken.publicToken + " 입니다.");
                }
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if (command === '사용자 목록') {
            if (admin.check(msg.author.id)) {
                let guildList = new Map();
                client.guilds.forEach(guild => {
                    let guildToStore = new Map();
                    guild.members.forEach(member => {
                        guildToStore.set(member.displayName, member.id);
                    });
                    console.log(guildToStore);
                    guildList.set(guild.name,  JSON.stringify([...guildToStore]));
                });
                filehandler.saveFile('users.json', JSON.stringify([...guildList]));
            } else {
                reply(msg, '권한이 없습니다!');
            }
        }
                if (command === '뮤트') {
            let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
            if (!tomute) return msg.reply("유저를 찾을 수 없습니다");
            if (tomute.hasPermission("MANAGE_MESSAGES")) return msg.reply("당신은 권한이 없습니다");
            let muterole = msg.guild.roles.find(`name`, "muted");
            if (!muterole) {
                    muterole = msg.guild.createRole({
                        name: "muted",
                        color: "#000000",
                        permissions: []
                    })
                    msg.guild.channels.forEach(async (channel, id) => {
                         channel.overwritePermissions(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    }); 
                }  
            await(tomute.addRole(muterole.id));
            msg.reply(`<@${tomute.id}> 을 뮤트 했습니다`);
        }
        if (command === '언뮤트') {
            let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
            if (!tomute) return msg.reply("유저를 찾을 수 없습니다");
            if (tomute.hasPermission("MANAGE_MESSAGES")) return msg.reply("당신은 권한이 없습니다");
            let muterole = msg.guild.roles.find(`name`, "muted");
            await(tomute.removeRole(muterole.id));
            msg.reply(`<@${tomute.id}> 을 언뮤트 했습니다`);

        }
    }
});

client.login(config.token);
