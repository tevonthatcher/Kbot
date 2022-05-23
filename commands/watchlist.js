const mongoose = require('mongoose');
const { WatchList, connectDB } = require('../Schema');
const { SlashCommandBuilder } = require('@discordjs/builders');

//TODO: Movie Info command, IMDB Integration

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
                }).setRequired(true))
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
                    }).setRequired(true)))
        .addSubcommand((subcommand) => subcommand
            .setName("remove")
            .setDescription("Remove a movie from the watchlist.")
            .addStringOption((option) => option.setName("name").setDescription("The name of the movie.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand
            .setName("list")
            .setDescription("List the movies in the watchlist.")
            .addStringOption((option) => option.setName("name").setDescription("The name of the movie."))
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
                    }))),

    async execute(interaction) {
        if(interaction.options.getSubcommand() == "add"){
            await connectDB().then(async () => {
                let name = interaction.options.getString("name");
                let released = interaction.options.getString("released");
                let genre = interaction.options.getString("genre");

                if(released == "yes"){
                    released = true;
                } else{
                    released = false;
                }
                
                try{
                    let newWatchList = new WatchList({
                        name: name,
                        released: released,
                        genre: genre,
                    });

                    await newWatchList.save();
            
                    return interaction.reply(({ content: "Added Movie to Watchlist!", ephemeral: true }));
                } catch(error){
                    if(error.code == 11000){
                        return interaction.reply(({ content: "Movie already in Watchlist!", ephemeral: true }));
                    } else{
                        return interaction.reply(({ content: "Something went wrong!", ephemeral: true }));
                    }
                }

            }).catch(console.error);

        } else if(interaction.options.getSubcommand() == "remove"){
            await connectDB().then(async () => {
                let name = interaction.options.getString("name");
                
                const res = await WatchList.deleteOne({ where: { name: name } });
    
                if(res.deletedCount === 0){
                    return interaction.reply(({ content: "Movie does not exist!", ephemeral: true }));
                }
    
                return interaction.reply(({ content: "Removed Movie!", ephemeral: true }));

            }).catch(console.error);

        } else if(interaction.options.getSubcommand() == "list"){
            let name = interaction.options.getString("name");
            let released = interaction.options.getString("released");
            let genre = interaction.options.getString("genre");

            if(released == "yes"){
                released = true;
            } else if(released == "no"){
                released = false;
            }

            if((name == null) && (released == null) && (genre == null)){
                connectDB().then(async () => {
                    const res = await WatchList.find({});

                    let message = "";

                    for(let i = 0; i < res.length; i++){
                        message += res[i].name + "\n";
                    }

                    return interaction.reply(({ content: message, ephemeral: true }));

                }).catch(console.error);

            } else if((name != null) && (released == null) && (genre == null)){
                connectDB().then(async () => {
                    const res = await WatchList.find({ name: name });

                    if(res.length === 0){
                        return interaction.reply(({ content: "Movie does not exist!", ephemeral: true }));
                    }

                    let message = "";

                    for(let i = 0; i < res.length; i++){
                        message += res[i].name + "\n";
                    }

                    return interaction.reply(({ content: message, ephemeral: true }));

                }).catch(console.error);
            } else if((name == null) && (released != null) && (genre == null)){
                connectDB().then(async () => {
                    const res = await WatchList.find({ released: released });

                    if(res.length === 0){
                        return interaction.reply(({ content: "No movies released!", ephemeral: true }));
                    }

                    let message = "";

                    for(let i = 0; i < res.length; i++){
                        message += res[i].name + "\n";
                    }

                    return interaction.reply(({ content: message, ephemeral: true }));

                }).catch(console.error);
            } else if((name == null) && (released == null) && (genre != null)){
                connectDB().then(async () => {
                    const res = await WatchList.find({ genre: genre });

                    if(res.length === 0){
                        return interaction.reply(({ content: "No movies of this genre!", ephemeral: true }));
                    }

                    let message = "";

                    for(let i = 0; i < res.length; i++){
                        message += res[i].name + "\n";
                    }

                    return interaction.reply(({ content: message, ephemeral: true }));

                }).catch(console.error);
            } else{
                await connectDB().then(async () => {
                    const res = await WatchList.find({ 
                        $or: [
                            { $and: [{ name: name }, { genre: genre }, { released: released }] },
                            { $and: [{ name: name }, { released: released }] },
                            { $and: [{ genre: genre }, { released: released }] },
                            { $and: [{ name: name }, { genre: genre }] },
                        ]
                    });

                    let message = "";

                    for(let i = 0; i < res.length; i++){
                        message += res[i].name + "\n";
                    }

                    if(res.length === 0){
                        return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                    }
                    
                    return interaction.reply(({ content: message, ephemeral: true }));

                }).catch(console.error);
            }

        } else if(interaction.options.getSubcommand() == "clear"){
            let query = interaction.options.getString("query");

            if(query == null){
                await connectDB().then(async () => {
                    const res = await WatchList.deleteMany({});

                    return interaction.reply(({ content: "Watchlist cleared!", ephemeral: true }));
                }).catch(console.error);
            } else{
                await connectDB().then(async () => {
                    const res = await WatchList.deleteMany({ 
                        $or: [
                            { name: query },
                            { genre: query },
                            { released: query },
                        ]
                    });

                    if(res.deletedCount === 0){
                        return interaction.reply(({ content: "No movies found!", ephemeral: true }));
                    }
                    
                    return interaction.reply(({ content: "Removed Movies!", ephemeral: true }));
                }).catch(console.error);
            }
        }
    },
};