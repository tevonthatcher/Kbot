const mongoose = require('mongoose');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Soundlist, connectDB } = require('../Schema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('remove sounds from the soundboard')
        .addStringOption((option) => option.setName("name").setDescription("The name of the sound.").setRequired(true)),
    async execute(interaction) {
        await connectDB().then(async () => {
            let name = interaction.options.getString("name");
            
            const res = await Soundlist.deleteOne({ name: name });

            if(res.deletedCount === 0){
                return interaction.reply(({ content: "Sound does not exist!", ephemeral: true }));
            }

            return interaction.reply(({ content: "Removed sound!", ephemeral: true }));
        }).catch(console.error);
    },
};