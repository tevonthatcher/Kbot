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
        .setName('remove')
        .setDescription('remove sounds from the soundboard')
        .addStringOption((option) => option.setName("name").setDescription("The name of the sound.").setRequired(true)),
    async execute(interaction) {
        await Tags.sync().then(async () => {
            let name = interaction.options.getString("name");
            
            const rowCount = await Tags.destroy({ where: { name: name } });

            if(!rowCount){
                return interaction.reply(({ content: "Sound does not exist!", ephemeral: true }));
            }

            return interaction.reply(({ content: "Removed sound!", ephemeral: true }));
        }).catch(console.error);
    },
};