const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const { Player, QueryType } = require('discord-player');

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
        .setName('sb')
        .setDescription('Play preset sounds from the soundboard.')
        .addStringOption((option) => option.setName("sound").setDescription("The sound to play.").setRequired(true)),
    async execute(interaction) {
        if (interaction.member.voice.channel == null) {
            await interaction.reply({ content: 'Not in a voice channel.', ephemeral: true });
        } else {
            const player = new Player(interaction.client);
            const queue = player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });

            // verify vc connection
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
            }

            let soundName = interaction.options.getString("sound");

            const tag = await Tags.findOne({ where: { name: soundName } });

            if(tag){
                await interaction.deferReply();
                const track = await player.search(tag.url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.YOUTUBE_VIDEO
                    }).then(tracks => tracks.tracks[0])
                    if (!track) return await interaction.followUp({ content: `❌ | Track not found!` , ephemeral: true });
    
                    queue.play(track);
    
                    return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` , ephemeral: true });
            } else{
                return await interaction.reply({ content: "Sound does not exist!", ephemeral: true });
            }
        }      
    },
};