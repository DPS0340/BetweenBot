// 이건 아직 제대로 정리되지 않았습니다.
// TODO
const ytdl = require('ytdl-core');
const translate = require('@vitalets/google-translate-api');
const superagent = require("superagent");
const filehandler = require('../filehandler');
const admin = require('../admin');
const blacklist = require('../blacklist');
const token = require('../token');
const request = require('request');
const stringhandler = require('../stringhandler');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../botsetting.json');
const melon = require('melon-chart-api');
const osu = require('node-osu');
const api = new osu.Api(`4b6523b6d53ded37e04033429752cfc44e841dc6`, {
    notFoundAsError: true,
    completeScores: false
});
const ytSearch = require( 'yt-search' )

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
    '어드민': (msg, command) => {
        if (admin.check(msg.author.id)) {
            msg.reply('당신은 어드민입니다!');
        } else {
            msg.reply('당신은 어드민이 아닙니다!');
        }
    },
    '헬로': (msg, command) => {
        msg.channel.send("헬로!");
    },
    '블랙리스트 추가': (msg, command) => {
        if (admin.check(msg.author.id)) {
            let blacklistid = command.split(" ")[1];
            blacklist.add(blacklistid);
            reply(msg, blacklistid + '님은 이제 더이상 봇을 이용하실 수 없습니다.');
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '블랙리스트 해제': (msg, command) => {
        if (admin.check(msg.author.id)) {
            let notblacklistid = command.split(" ")[1];
            blacklist.remove(id);
            msg.channel.send(notblacklistid + '님은 이제 다시 봇을 이용가능합니다!');
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '블랙리스트': (msg, command) => {
        if (admin.check(msg.author.id)) {
            msg.reply(msg, '블랙리스트 목록:');
            for (let id of blacklist.get()) {
                msg.channel.send(id);
            }
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '밴': (msg, command) => {
        let args = stringhandler.argsParse('밴', 'command');
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
            reply(msg, '권한이 없습니다!');
            return;
        }
        if (args[0] === "help") {
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
        msg.reply(bUser.tag);
        msg.guild.ban(bUser);
        msg.channel.send(banEmbed);
    },
    'clear': (msg, command) => {
        let args = stringhandler.argsParse('clear', command);
        if (!args[0]) return msg.reply("숫자를 써주세요");
        msg.channel.bulkDelete(Number(args[0]) + 1).then(() => {
            reply(msg, `메세지 ${args[0]} 만큼 삭제했습니다.`);
        });
    },
    '언밴': (msg, command) => {
        let args = stringhandler.argsParse('언밴', 'command');
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
        msg.channel.send(unbanEmbed);
    },
    'userinfo': (msg, command) => {
        let args = stringhandler.argsParse('userinfo', 'command');
        function senduserinfo(user) {
            embed.setAuthor(`User Information`)
                .setColor(`${config.color}`)
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
        }
    },
    'serverembed': (msg, command) => {
        let serverembed = new Discord.RichEmbed()
            .setDescription("Server Information")
            .setColor(`${config.color}`)
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
    },
    '웹토큰 발급': (msg, command) => {
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
    },
    '웹토큰 리보크': (msg, command) => {
        if (admin.check(msg.author.id)) {
            token.revoke(msg.author.tag);
            reply(msg, "토큰 리보크 완료!");
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '웹토큰 확인': (msg, command) => {
        if (admin.check(msg.author.id)) {
            if(token.checkHasToken(msg.author.tag)) {
                reply(msg, "이 토큰은 유효합니다!");
            } else {
                reply(msg, "이 토큰은 유효하지 않습니다!");
            }
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '웹토큰 초기화': (msg, command) => {
        if (admin.check(msg.author.id)) {
            token.resetTokenList();
            reply(msg, "토큰 초기화 완료!");
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '웹토큰 리스트': (msg, command) => {
        if (admin.check(msg.author.id)) {
            for (let [name, aToken] of token.get()) {
                msg.channel.send(name + " 님의 토큰은 " + aToken.publicToken + " 입니다.");
            }
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '사용자 목록': (msg, command) => {
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
    },
    '뮤트': (msg, command) => {
        let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
        if (!tomute) return msg.reply("유저를 찾을 수 없습니다");
        if (tomute.hasPermission("MANAGE_MESSAGES")) return msg.reply("당신은 권한이 없습니다");
        let muterole = msg.guild.roles.find(`name`, "muted");
        if (!muterole) {
            muterole = msg.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: []
            });
            msg.guild.channels.forEach(async (channel, id) => {
                channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        }
        tomute.addRole(muterole.id);
        msg.reply(`<@${tomute.id}> 을 뮤트 했습니다`);
    },
    '언뮤트': (msg, command) => {
        let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]));
        if (!tomute) return msg.reply("유저를 찾을 수 없습니다");
        if (tomute.hasPermission("MANAGE_MESSAGES")) return msg.reply("당신은 권한이 없습니다");
        let muterole = msg.guild.roles.find(`name`, "muted");
        tomute.removeRole(muterole.id);
        msg.reply(`<@${tomute.id}> 을 언뮤트 했습니다`);
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
    '번역': (msg, command) => {
        let destLocale = args[1];
        let originalText = command.substring(command.indexOf(destLocale) + destLocale.length, command.length);
        translateAndSendMessage(msg, destLocale, originalText);
    },
    'roleinfo': (msg, command) => {
        let role = msg.mentions.roles.first() || msg.guild.roles.get(args[1]) || msg.guild.roles.find(role => role.name === args[1]);
        if (!role) role = msg.member.highestRole;
        let embed = new Discord.RichEmbed()
            .setColor(role.hexColor)
            .setTitle(`역할: ${role.name}`)
            .addField('멤버', role.members.size)
            .addField('Hex', role.hexColor)
            .addField('만든 날짜', role.createdAt.toDateString())
            .addField('편집 가능 여부', role.editable.toString())
            .addField('관리 권한', role.managed.toString())
            .addField('아이디', role.id);
        msg.channel.send(embed);
    },
    'hex': (msg, command) => {
        let color = ((1 << 24) * Math.random() | 0).toString(16);
        let embed = new Discord.RichEmbed()
            .setTitle(`#${color}`)
            .setColor(`#${color}`);
        msg.channel.send({ embed: embed });
    },
    '핑': (msg, command) => {
        msg.reply('**' + Math.round(client.ping) + 'ms!**');
        return true;
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
    '데이터 리스트': (msg, command) => {
        if (admin.check(msg.author.id)) {
            let files = filehandler.getFileList();
            for (let file of files) {
                msg.reply(file);
            }
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '한강': (msg, command) => {
        let url = 'http://hangang.dkserver.wo.tc/';
        request(url, function (err, response, body) {
            if (err) {
                return msg.reply('에러');
            }
            body = JSON.parse(body);
            if (body.result) {
                if (body.temp, body.time) {
                    let embed = new Discord.RichEmbed()
                        .setColor(`${config.color}`)
                        .setTimestamp()
                        .setTitle("한강 물 온도")
                        .setURL("https://www.wpws.kr/hangang/")
                        .addField("물 온도", body.temp, true)
                        .addField(`최종 확인 시간`, body.time, true);
                    msg.channel.send(embed);
                }
            }
        })
    },
    '채널 추가': (msg, command) => {
        if (!msg.member.hasPermission("MANAGE_CHANNELS")) {
            reply(msg, '권한이 없습니다!');
            return;
        }
        let channel = stringhandler.argsParse('채널 추가', command)[0];
        msg.guild.createChannel(channel, 'text')
            .then(console.log)
            .catch(console.error);
    },
    '길드 수정': (msg, command) => {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
            reply(msg, '권한이 없습니다!');
            return;
        }
        let guild = stringhandler.argsParse('길드 수정', command)[0];
        msg.guild.edit({
            name: guild
        });
    },
    '초대링크': (msg, command) => {
        if (!msg.member.hasPermission("CREATE_INSTANT_INVITE")) {
            reply(msg, '권한이 없습니다!');
            return;
        }
        msg.channel.createInvite()
            .then(invite => msg.channel.send(`discord.gg/${invite.code}`))
            .catch(console.error);
    },
    'osu': (msg, command) => {
        let username = stringhandler.argsParse('osu', command)[0];
        if (!username[0]) return message.channel.send('osu닉네임을 적어주세요!');
        api.getUser({ u: username }).then(user => {
            const embed = new Discord.RichEmbed()
                .setThumbnail(`http://s.ppy.sh/a/${user.id}`)
                .setColor("#D0436A")
                .addField('닉네임', user.name, true)
                .addField('PP', Math.round(user.pp.raw), true)
                .addField('랭크', user.pp.rank, true)
                .addField('레벨', Math.round(user.level), true)
                .addBlankField()
                .addField('국가', user.country, true)
                .addField('국가 랭크', user.pp.countryRank, true)
                .addField('플레이 수', user.counts.plays, true)
                .addField('성공', `${user.accuracyFormatted}`, true)
                .setFooter('명령어 쓴 사람 ' + msg.author.tag, msg.author.avatarURL)
            msg.channel.send(embed)

        })
    },
    'mc': (msg, command) => {
        let name = stringhandler.argsParse('mc', command)[0];
        if (!command[0]) return message.channel.send('닉네임을 적어주세요!');
        let url = `https://api.mojang.com/users/profiles/minecraft/` + `${name}`;
        request(url, function (err, response, body) {
            if (err) {
                return msg.reply('에러');
            }
            body = JSON.parse(body);
            if (body.id, body.name) {
                let url1 = `https://visage.surgeplay.com/full/512/${body.id}`;
                let url2 = `https://visage.surgeplay.com/head/512/${body.id}`;
                let url3 = `https://visage.surgeplay.com/face/512/${body.id}`;
                let embed = new Discord.RichEmbed()
                    .setColor(`${config.color}`)
                    .setTimestamp()
                    .setAuthor(`${msg.author.username}`, url3)
                    .setTitle(`${body.name}의 마인크래프트 정보`)
                    .addField("이름", body.name, true)
                    .addField("uuid", body.id, true)
                    .setThumbnail(url2)
                    .setImage(url1);
                msg.channel.send(embed);
            } else {
                msg.channel.send("마크닉네임이 없습니다")
            }
        })
    },
    'uptime': (msg, command) => {
        function parse(a) {
            a = Number(a.toString().split('.')[0]);
            let day = Math.floor(a / 86400);
            a -= day * 86400;
            let hour = Math.floor(a / 3600);
            a -= hour * 3600;
            let minute = Math.floor(a / 60);
            a -= minute * 60;
            let second = a;
            return day + "일 " + hour + "시간 " + minute + "분 " + second + "초";
        }
        msg.channel.send(parse(process.uptime()));
    },
    'botinfo': (msg, command) => {
        if (admin.check(msg.author.id)) {
            let embed = new Discord.RichEmbed()
                .setTitle(`사이 봇의 정보`)
                .setColor(`${config.color}`)
                .addField("유저", `${client.users.size}`, true)
                .addField("서버", `${client.guilds.size}`, true)
                .addField("순수 유저", `${client.users.filter(a => a.bot == false).size}`, true)
                .addField("봇 개수", `${client.users.filter(a => a.bot == true).size}`, true)
                .setTimestamp();
            msg.channel.send(embed)
        } else {
            reply(msg, '권한이 없습니다!');
        }
    },
    '멜론': (msg, command) => {
        let now = new Date();
        let embed = new Discord.RichEmbed();
        now = (now.getMonth + 1) + '/' + now.getDate() + '/' + now.getFullYear;
        melon(now, { cutLine: 1 }).daily().then(res => {
            res.data.forEach(item => {
                let res1 = item.rank + ' 위';
                let res6 = item.title + ' - ' + item.artist;
                embed.addField(res1, res6, true);
            });
            msg.channel.send(embed);
        })
    },
    'play': (msg, command) => {
        function play(url) {
            ytdl.getInfo(url, {downloadURL: true}, (err, info) => {
                if (err) throw err;
                msg.channel.send("지금 플레이 중: " + info.title);
            });
            msg.member.voiceChannel.join().then(connection => {
                let streamOptions = { seek: 0, volume: 1, bitrate: 192000 };
                const stream = ytdl(url, { filter : 'audioonly' });
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    msg.channel.send("노래가 끝났습니다!");
                    msg.member.voiceChannel.leave();
                });
            }).catch(err => console.log(err));
        }
        if(!msg.member.voiceChannel) return msg.channel.send("음성채널에서 들어가주세요!");
        if (msg.guild.me.voiceChannel) return msg.channel.send(`이미 ${msg.guild.me.voiceChannel}에서 노래를 하고 있습니다`);
        const raw = stringhandler.cutTextHead('play ', command);
        if (!raw) return msg.channel.send("인자가 없습니다");
        let url = raw;
        let validate = ytdl.validateURL(url);
        if (!validate) {
            ytSearch(url, function ( err, r ) {
                try {
                    play("https://youtube.com" + r.videos[0].url);
                } catch {
                    msg.channel.send("검색 결과가 없습니다!");
                }
            });
        } else {
            play(url)
        }
    },
    'exit': (msg, command) => {
        if (msg.guild.me.voiceChannel) msg.member.voiceChannel.leave();
    },
    'kick': (msg, command) => {
        let args = stringhandler.argsParse('kick', command);
        if (!msg.member.hasPermission("KICK_MEMBERS")) return;
        if (args[0] === "help") {
            msg.reply(`${config.prefix}kick <유저 맨션>`);
            return;
        }
        let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        msg.guild.member(kUser).kick("없음");
        msg.channel.send(kUser + " 유저를 성공적으로 킥 했습니다");
    },
};
