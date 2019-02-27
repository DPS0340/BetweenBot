const admin = require('../admin');
const token = require('../token');

module.exports = {
    '웹토큰 발급': (msg, command) => {
        if (admin.check(msg.author.id)) {
            if(token.checkHasToken(msg.author.tag)) {
                token.revoke(msg.author.tag);
                msg.reply('이미 발급된 토큰이 있습니다!');
                msg.channel.send('기존 토큰을 리보크하고 새 토큰을 발급합니다!');
            } else {
                msg.reply('신규 토큰을 발급합니다!');
            }
            msg.channel.send(token.generate(msg.author.tag));
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
    '웹토큰 리보크': (msg, command) => {
        if (admin.check(msg.author.id)) {
            token.revoke(msg.author.tag);
            msg.reply("토큰 리보크 완료!");
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
    '웹토큰 확인': (msg, command) => {
        if (admin.check(msg.author.id)) {
            if(token.checkHasToken(msg.author.tag)) {
                msg.reply("이 토큰은 유효합니다!");
            } else {
                msg.reply("이 토큰은 유효하지 않습니다!");
            }
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
    '웹토큰 초기화': (msg, command) => {
        if (admin.check(msg.author.id)) {
            token.resetTokenList();
            msg.reply("토큰 초기화 완료!");
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
    '웹토큰 리스트': (msg, command) => {
        if (admin.check(msg.author.id)) {
            for (let [name, aToken] of token.get()) {
                msg.channel.send(name + " 님의 토큰은 " + aToken.publicToken + " 입니다.");
            }
        } else {
            msg.reply('권한이 없습니다!');
        }
    },
};