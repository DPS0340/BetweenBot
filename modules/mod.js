const admin = require('../admin');
const blacklist = require('../blacklist');
const Discord = require('discord.js');
const config = require('../botsetting.json');

module.exports = {
    '어드민': (msg, command) => {
        if (admin.check(msg.author.id)) {
            msg.reply('당신은 어드민입니다!');
        } else {
            msg.reply('당신은 어드민이 아닙니다!');
        }
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
            msg.reply('권한이 없습니다!');
        }
    },
    '블랙리스트': (msg, command) => {
        if (admin.check(msg.author.id)) {
            msg.reply(msg, '블랙리스트 목록:');
            for (let id of blacklist.get()) {
                msg.channel.send(id);
            }
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
    '밴': (msg, command) => {
        let args = stringhandler.argsParse('밴', 'command');
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
            msg.reply('권한이 없습니다!');
            return;
        }
        if (args[0] === "help") {
            msg.reply(`: ${config.prefix}밴 유저멘션 사유`);
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
            msg.reply('권한이 없습니다!');
            return;
        }
        if (args[1] === "help") {
            msg.reply(`: ${config.prefix}언밴 유저맨션 사유`);
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
            msg.reply('권한이 없습니다!');
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
    'afk': (msg, command) => {
        return this.setPresence({ afk });
        msg.channel.send("This user is now AFK.")
    },

  }
};
