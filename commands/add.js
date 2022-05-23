const mongoose = require('mongoose');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Soundlist, connectDB } = require('../Schema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add custom sounds to the soundboard.')
        .addStringOption((option) => option.setName("url").setDescription("The url of the sound.").setRequired(true))
        .addStringOption((option) => option.setName("name").setDescription("The name of the sound.").setRequired(true))
        .addStringOption((option) => option.setName("description").setDescription("The description of the sound.")),

    async execute(interaction) {
        await connectDB().then(async () => {
            let url = interaction.options.getString("url");
            let name = interaction.options.getString("name");
            let description = interaction.options.getString("description");

            try{
                let sound = new Soundlist({
                    name: name,
                    url: url,
                    description: description
                });

                await sound.save();
        
                return interaction.reply(({ content: "Added sound!", ephemeral: true }));
            } catch(error){
                if(error.code === 11000){
                    return interaction.reply(({ content: "That sound already exists!", ephemeral: true }));
                } else{

                    return interaction.reply(({ content: "There was an error while adding the sound!", ephemeral: true }));
                }
            }
        }).catch(console.error);
    },
};