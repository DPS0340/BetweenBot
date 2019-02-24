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
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.startsWith(config.prefix)) {
        if(blacklist.check((msg.author.id))) {
            reply(msg, '당신은 이 봇을 쓸 수 없습니다!');
            return;
        }
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
        if(command.startsWith('블랙리스트 추가')) {
            if(admin.check(msg.author.id)) {
                let blacklistid = command.split(" ")[2];
                blacklist.list.push(blacklistid);
                blacklist.save();
                reply(msg, blacklistid + '님은 이제 더이상 봇을 이용하실 수 없습니다.');
            }
            else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if(command.startsWith('블랙리스트 해제')) {
            if(admin.check(msg.author.id)) {
                let notblacklistid = command.split(" ")[2];
                blacklist.list = blacklist.list.filter(id => notblacklistid !== id);
                blacklist.save();
                msg.channel.send(blacklistid + '님은 이제 다시 봇을 이용가능합니다!'); // 번역 TODO 인 것
            }
            else {
                reply(msg, '권한이 없습니다!');
            }
        }
        if(command === '블랙리스트') {
            if(admin.check(msg.author.id)) {
                msg.reply(msg);
                for(let id of blacklist.list) {
                    msg.channel.send(id);
                }
            }
            else {
                reply(msg, '권한이 없습니다!');
            }
        }
    }
if(command.startsWith('밴')) {  
 if(!command.member.hasPermission("BAN_MEMBERS")) return ;
 if(args[0] == "help"){
   message.reply(`Usage: ${config.prefix}밴 유저맨션 사유`);
   return;
 }
 let bUser = command.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
 if(!bUser) return errors.cantfindUser(message.channel);
 if(bUser.id === client.user.id) return errors.botuser(message); 
 let bReason = args.join(" ").slice(22);
 if(!bReason) return errors.noReason(message.channel);
    
 let banEmbed = new Discord.RichEmbed()
 .setDescription("~Ban~")
 .setColor("#bc0000")
 .addField("밴 유저", `${bUser} 와 아이디 ${bUser.id}`)
 .addField("밴한 유저", `<@${message.author.id}> 와 아이디 ${message.author.id}`)
 .addField("밴된 채널", message.channel)
 .addField("시간", message.createdAt)
 .addField("사유", bReason);

 message.guild.member(bUser).ban(bReason);
 incidentchannel.send(banEmbed);
}

});

client.login(config.token);
