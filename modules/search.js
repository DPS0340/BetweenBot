module.exports = {
    '유튜브': (msg, command) => {
        let youtube = args.slice(0).join('+');

        let link = `https://www.youtube.com/results?search_query=` + youtube;
        if (!youtube) return message.reply(`Please enter a keyword.`)
        if (!link) return message.reply("Please enter a keyword, no a link.")
        let embed = new Discord.RichEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField('Action:', 'Searching on youtube')
            .addField("Word:", `${args.slice(0).join(' ')}`)
            .addField('Link:', `${link}`)
            .setFooter("Your avatar", message.author.avatarURL);

        message.channel.send(embed);
    }
}
