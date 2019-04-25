// Imports
let mongoose = require('mongoose'); // Import mongoose for connecting to a mongo database
let schema = mongoose.Schema; // Initialize a new Schema object

// Setup a Mongo schema for a user
let userSchema = new schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

// Initialize the new user schema
let User = mongoose.model('User', userSchema);

// Export the user object for usage in other files
module.exports = User;
