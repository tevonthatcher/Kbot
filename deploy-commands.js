const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { discord_token, clientID } = require('./Schema');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(discord_token);

rest.put(Routes.applicationCommands(clientID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);