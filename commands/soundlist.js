const Sequelize = require('sequelize');
const { SlashCommandBuilder } = require('@discordjs/builders');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
    url: {
        type: Sequelize.STRING,
        unique: true,
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundlist')
        .setDescription('List all sounds in the soundboard.'),
    async execute(interaction) {
        const tagList = await Tags.findAll();
        const tagString = tagList.map(tag => `${tag.name}`).join("\n");

        if(tagString.length === 0){
            return interaction.reply(({ content: "No sounds found!", ephemeral: true }));
        } else {
            return interaction.reply(`List of Tags: ${tagString}`);
        }
    },
};