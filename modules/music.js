const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const stringhandler = require('../stringhandler');
const config = require('../botsetting.json');
module.exports = {
    'play': (msg, command) => {
        function play(url) {
            ytdl.getInfo(url, {downloadURL: true}, (err, info) => {
                if (err) throw err;
                let embed = new Discord.RichEmbed()
                    .setTitle(info.title)
                    .setURL(url)
                    .setThumbnail(`https://img.youtube.com/vi/${info.video_id}/mqdefault.jpg`)
                    .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
                    .setColor(`${config.color}`)
                    .setFooter(`출처: ${info.author.name}`)
                    .setTimestamp();
                // embed.addField('설명', info.description, true); 이건 embed 1024자 넘으면 에러 떠서 안씁니다
                msg.channel.send(embed);
            });
            msg.member.voiceChannel.join().then(connection => {
                let streamOptions = {seek: 0, volume: 1, bitrate: 64000};
                const stream = ytdl(url, {filter: 'audioonly'});
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    msg.channel.send("노래가 끝났습니다!");
                    msg.member.voiceChannel.leave();
                });
            }).catch(err => console.log(err));
        }

        if (!msg.member.voiceChannel) return msg.channel.send("음성채널에서 들어가주세요!");
        if (msg.guild.me.voiceChannel) return msg.channel.send(`이미 ${msg.guild.me.voiceChannel}에서 노래를 하고 있습니다`);
        const raw = stringhandler.cutTextHead('play ', command);
        if (!raw) return msg.channel.send("인자가 없습니다");
        let url = raw;
        let validate = ytdl.validateURL(url);
        if (!validate) {
            ytSearch(url, function (err, r) {
                try {
                    let embed = new Discord.RichEmbed()
                        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
                        .setColor(`${config.color}`);
                    for (let i = 0; i < 5; i++) {
                        embed.addfield(i + 1 + "번째: " + r.videos[i].title, "ㅡ출처: " + r.videos[i].author.name + "\n", true);
                    }
                    msg.channel.send(embed);
                    function checkRecursive(msg) {
                        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {
                            max: 1,
                            time: 10000
                        });
                        collector.on('collect', m => {
                            const check = (message) => {
                                let num = Number(message.content);
                                play("https://youtube.com" + r.videos[num-1].url);
                            };
                            try {
                                check(m);
                            } catch (e) {
                                m.channel.send("1 ~ 5 사이의 숫자로 입력해 주세요.");
                                checkRecursive(msg);
                            }
                        });
                    }

                    checkRecursive(msg);
                } catch (e) {
                    msg.channel.send("검색 결과가 없습니다!");
                    console.log(e);
                }
            });
        } else {
            play(url)
        }
    },
    'exit': (msg, command) => {
        if (msg.guild.me.voiceChannel) msg.member.voiceChannel.leave();
    },
};
