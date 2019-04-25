// Imports
const authentication = require('../../authentication/authentication'); // Load authentication file for encoding/decodign jwt
const jsonModel = require('../../models/response/jsonModel'); // Load jsonModel for responses
const bcrypt = require('bcrypt'); // Import bcrypt for encrypting data
const User = require('../schema/user'); // Load user Mongo schema

// Instantiate a new class with reusable methods

module.exports = class userRepo {

    static async createUser(usernameParam, emailParam, passwordParam, httpMethod, res) {

        // Set the amount of salt rounds for bcrypt
        const BCRYPT_SALT_ROUNDS = 12;

        const reqUrl = '/api/register';

        // Check if the user exists in database
        await User.findOne({username: usernameParam})
            .then((user) => {
                // Check if the username exists
                if (user === null) {
                    // Hash the password with bcrypt
                    bcrypt.hash(passwordParam, BCRYPT_SALT_ROUNDS)
                        .then((hashedPassword) => {
                            // Create new user object to save in the database
                            const newUser = new User ({
                                username: usernameParam,
                                email: emailParam,
                                password: hashedPassword
                            });
                            // Save the new user in the database
                            newUser.save();
                        })
                        .catch(() => {
                            res.status(500).json(new jsonModel(reqUrl, httpMethod, 500, "Something went wrong"));
                        })
                } else {
                    res.status(409).json(new jsonModel(reqUrl, httpMethod, 409, "Username already exists, pick another one"));
                }
            }).catch(() => {
                res.status(409).json(new jsonModel(reqUrl, httpMethod, 409, "Username already exists, pick another one"));
            })
    }

    static async login(usernameParam, passwordParam, httpMethod, res) {
        const reqUrl = "/api/login";
        let userId;

        // Search the database for the supplied username
        await User.findOne({username: usernameParam})
            .then((user) => {
                // set userId
                userId = user._id;
                // Check if the supplied password is the same as the user's password
                return bcrypt.compare(passwordParam, user.password);

            })
            .then((samePassword) => {
                if (samePassword) {
                    // Assign a token to the user
                    let token = authentication.encodeToken(userId, usernameParam);
                    res.status(200).json({
                        response: new jsonModel(reqUrl, httpMethod, 200, "You have succesfully logged in"),
                        token: token
                    });
                } else {
                    res.status(412).json(new jsonModel(reqUrl, httpMethod, 412, "Password is incorrect"));
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(404).json(new jsonModel(reqUrl, httpMethod, 404, "User not found"));
            })
    }

};