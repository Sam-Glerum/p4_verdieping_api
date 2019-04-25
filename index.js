// Imports
let express = require('express'); // Load express framework
let bodyParser = require('body-parser'); // Load body-parser to parse request body
let cors = require('cors'); // Load cors for Cross-Origin requests
let databaseConnection = require('./data/database/mongo_connect');

const PORT = process.env.port || 8080;

// Load dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Initialize new express instance
let server = express();

// Tell the server to enable the body-parser for parsing request bodies
server.use(bodyParser.json());

// Enable CORS to allow Cross-Origin requests
server.use(cors());



// Establish connection with Mongo DB
databaseConnection.connectToDB();

//###############
//#Route loading#
//###############

// Send every request to /api and subdomains to the authentication routes to make sure the user is authenticated
server.use('/api', require('./routes/v1/authentication_routes'));

// Start the server
server.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});

// export server object for use in other files
module.exports = server;