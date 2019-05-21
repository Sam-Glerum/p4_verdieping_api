// Imports
let mongoose = require('mongoose');

let url;
const DATABASE_NAME = "p4_db";

module.exports = class mongoConnect {
    static connectToDB()
    {
        if (process.env.NODE_ENV !== 'production') {
            url = "mongodb://127.0.0.1:27017/" + DATABASE_NAME;
        }
        // Establish a connection with the Mongo database
        mongoose.connect(url, {useNewUrlParser: true})
            .catch(() => {
                console.log('Could not connect to mongo db');
            });

        // Print a message to show the connection has been established
        mongoose.connection.once('open', () => {
            console.log('Connected to the mongo database ' + DATABASE_NAME)
        })
    }
};

