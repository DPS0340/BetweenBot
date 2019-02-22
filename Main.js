var Discord = require('discord.js');
var client = new Discord.Client();
const config = require('./botsetting.json');
client.login(config.token);
