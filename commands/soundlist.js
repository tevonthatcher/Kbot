const mongoose = require('mongoose');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Soundlist, connectDB } = require('../Schema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundlist')
        .setDescription('List all sounds in the soundboard.'),
    async execute(interaction) {
        const sounds = await connectDB().then(async () => {
            return await Soundlist.find();
        }).catch(console.error);

        if(sounds.length != 0) {
            let soundList = '';
            sounds.forEach(sound => {
                soundList += `${sound.name}\n`;
            });
            return await interaction.reply({ content: soundList, ephemeral: true });
        } else{
            return await interaction.reply({ content: "No sounds found!", ephemeral: true });
        }
    },
};