const {Client , Intents} = require('discord.js');
const client = new Client({intents: []});

client.on('ready', () => {
  console.log(`Logged in...`);
});

client.on('message', msg => {
  msg.reply('pong');
});

client.login(process.env.DISCORD_TOKEN);

const prefix = `!`;
client.on("message", function (message) {
  console.log(message)
})