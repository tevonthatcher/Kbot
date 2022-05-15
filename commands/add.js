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
        .setName('add')
        .setDescription('Add custom sounds to the soundboard.')
        .addStringOption((option) => option.setName("url").setDescription("The url of the sound.").setRequired(true))
        .addStringOption((option) => option.setName("name").setDescription("The name of the sound.").setRequired(true))
        .addStringOption((option) => option.setName("description").setDescription("The description of the sound.")),

    async execute(interaction) {
        await Tags.sync().then(async () => {
            let url = interaction.options.getString("url");
            let name = interaction.options.getString("name");
            let description = interaction.options.getString("description");

            try{
                const tag = await Tags.create({
                    url: url,
                    name: name,
                    description: description
                })
        
                return interaction.reply(({ content: "Added sound!", ephemeral: true }));
            } catch(error){
                if (error.name === "SequelizeUniqueConstraintError") {
                    return interaction.reply(({ content: "Sound already exists!", ephemeral: true }));
                }
                return interaction.reply(({ content: "Something went wrong!", ephemeral: true }));
            }
        }).catch(console.error);
    },
};