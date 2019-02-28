const Discord = require('discord.js');
const melon = require('melon-chart-api');
const config = require('../botsetting.json');
const osu = require('node-osu');
const api = new osu.Api(`4b6523b6d53ded37e04033429752cfc44e841dc6`, {
    notFoundAsError: true,
    completeScores: false
});
const stringhandler = require('../stringhandler');
const admin = require('../admin');


module.exports = {
    'userinfo': (msg, command) => {
        let args = stringhandler.argsParse('userinfo', 'command');
        function senduserinfo(user) {
            embed.setAuthor(`User Information`)
                .setColor(`${config.color}`)
                .setAuthor(user.username)
                .setDescription(`${user.username}님의 정보입니다!`)
                .setThumbnail(user.displayAvatarURL)
                .addField('이름:', `${user.tag}`)
                .addField('아이디:', `${user.id}`)
                .addField('계정 생성일:', user.createdAt);
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
            .addField("서버 이름", msg.guild.name)
            .addField("서버 생성일", msg.guild.createdAt)
            .addField("참가일", msg.member.joinedAt)
            .addField("총 멤버수", msg.guild.memberCount)
            .addField("역할", msg.guild.roles.reduce((role, result) => result += role + ' '))
            .addField("소유자", msg.guild.owner)
            .addField("채널", msg.guild.channels.size)
            .addField("아이디", msg.guild.id);
        msg.channel.send(serverembed);
    },
    'botinfo': (msg, command) => {
        if (admin.check(msg.author.id)) {
            let embed = new Discord.RichEmbed()
                .setTitle(`사이 봇의 정보`)
                .setColor(`${config.color}`)
                .addField("User", `${client.users.size}`, true)
                .addField("Server", `${client.guilds.size}`, true)
                .addField("Only user", `${client.users.filter(a => a.bot == false).size}`, true)
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
};
