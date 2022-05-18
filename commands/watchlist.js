const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { SlashCommandBuilder } = require('@discordjs/builders');

const watchlistDB = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database2.sqlite',
});

//Movie Name
//Movie Released/Unreleased
//Movie Genre
const Tags = watchlistDB.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    released: {
        type: Sequelize.STRING,
    }, 
    genre: {
        type: Sequelize.STRING,
    }
});
//Movie Info command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('watchlist')
        .setDescription('Modify the watchlist.')
        .addSubcommand((subcommand) => subcommand
            .setName("add")
            .setDescription("Add a movie to the watchlist.")
            .addStringOption((option) => option.setName("name").setDescription("The name of the movie.").setRequired(true))
            .addStringOption((option) => option
                .setName("released")
                .setDescription("Is the movie released?")
                .addChoices({
                    name: "Yes",
                    value: "yes",
                },
                {
                    name: "No",
                    value: "no",
                }))
                .addStringOption((option) => option.setName("genre")
                    .setDescription("The genre of the movie.")
                    .addChoices({
                        name: "Movies",
                        value: "movies",
                    },
                    {
                        name: "TV Show",
                        value: "tvshow",
                    },
                    {
                        name: "Anime",
                        value: "anime",
                    })))
        .addSubcommand((subcommand) => subcommand
            .setName("remove")
            .setDescription("Remove a movie from the watchlist.")
            .addStringOption((option) => option.setName("name").setDescription("The name of the movie.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand
            .setName("list")
            .setDescription("List the movies in the watchlist.")
            .addStringOption((option) => option.setName("query").setDescription("Query Parameter etc. (Name, Genre, Released)")))
        .addSubcommand((subcommand) => subcommand
            .setName("clear")
            .setDescription("Clear the movies in the watchlist.")
            .addStringOption((option) => option.setName("query").setDescription("Query Parameter etc. (Name, Genre, Released)"))),

    async execute(interaction) {
        if(interaction.options.getSubcommand() == "add"){
            await Tags.sync().then(async () => {
                let name = interaction.options.getString("name");
                let released = interaction.options.getString("released");
                let genre = interaction.options.getString("genre");
                
                try{
                    const tag = await Tags.create({
                        name: name,
                        released: released,
                        genre: genre
                    })
            
                    return interaction.reply(({ content: "Added Movie to Watchlist!", ephemeral: true }));
                } catch(error){
                    if (error.name === "SequelizeUniqueConstraintError") {
                        return interaction.reply(({ content: "Movie already exists!", ephemeral: true }));
                    }
                    return interaction.reply(({ content: "Something went wrong!", ephemeral: true }));
                }

            }).catch(console.error);
        } else if(interaction.options.getSubcommand() == "remove"){
            await Tags.sync().then(async () => {
                let name = interaction.options.getString("name");
                
                const rowCount = await Tags.destroy({ where: { name: name } });
    
                if(!rowCount){
                    return interaction.reply(({ content: "Movie does not exist!", ephemeral: true }));
                }
    
                return interaction.reply(({ content: "Removed Movie!", ephemeral: true }));
            }).catch(console.error);
        } else if(interaction.options.getSubcommand() == "list"){
            let query = interaction.options.getString("query");

            if(query == null){
                const tagList = await Tags.findAll();
                const tagString = tagList.map(tag => `${tag.name}`).join("\n");
    
                if(tagString.length === 0){
                    return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                } else {
                    return interaction.reply(`List of Movies: ${tagString}`);
                }
            } else{
                const tagList = await Tags.findAll({where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { genre: { [Op.like]: `%${query}%` } },
                        { released: { [Op.like]: `%${query}%` } }
                    ]
                }});

                const tagString = tagList.map(tag => `${tag.name}`).join("\n");
    
                if(tagString.length === 0){
                    return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                } else {
                    return interaction.reply(`List of Movies: ${tagString}`);
                }
            }
        } else if(interaction.options.getSubcommand() == "clear"){
            let query = interaction.options.getString("query");

            if(query == null){
                const rowCount = await Tags.destroy({ where: {} });
                if(rowCount.length === 0){
                    return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                } else {
                    return interaction.reply(`Movies Deleted`);
                }
            } else{
                const rowCount = await Tags.destroy({ where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { genre: { [Op.like]: `%${query}%` } },
                        { released: { [Op.like]: `%${query}%` } }
                    ]
                }});

                if(rowCount.length === 0){
                    return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                } else {
                    return interaction.reply(`Movies Deleted`);
                }
            }
        }
    },
};