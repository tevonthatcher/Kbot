const mongoose = require('mongoose');

const dbURI = ''

const watchListSchema = new mongoose.Schema({
    name: String,
    released: Boolean,
    genre: String })

const WatchList = mongoose.model('WatchList', watchListSchema);

const soundboardSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
})

const Soundlist = mongoose.model('Soundlist', soundboardSchema);

const connectDB = async () => {
    mongoose.connect(process.env.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
}

module.exports = {
    WatchList, 
    Soundlist,
    discord_token: '',
    clientID: '',
    connectDB,
}