const {Client , Intents} = require('discord.js');
const client = new Client({intents: []});

client.on('ready', () => {
  console.log(`Logged in...`);
});

client.on('message', msg => {
  msg.reply('pong');
});

client.login('OTc1MDA4Nzc2MDEwNzI3NDQ2.GAOJmn.8uUmii1C2i1ecyKtxSJKODFiYtjc9ybrqt4nyM');

const prefix = `!`;
client.on("message", function (message) {
  console.log(message)
})