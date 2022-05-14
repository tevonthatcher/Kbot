const {Client , Intents} = require('discord.js');
const client = new Client({intents: []});

client.on('ready', () => {
  console.log(`Logged in...`);
});

client.login(process.env.DISCORD_TOKEN);