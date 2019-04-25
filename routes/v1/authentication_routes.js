// Imports
let express = require('express'); // Import express framework
let authentication = require('../../authentication/authentication'); // Load authentication.js
let jsonModel = require('../../models/response/jsonModel');
let userRepo = require('../../data/repository/userRepo');
let checkObjects = require('../../models/validation/CheckObjects');


// Set amount of salt rounds for bcrypt
const BCRYPT_SALT_ROUNDS = 12;

// Initialize a new express Router instance
let router = express.Router();



// Set content-type for every response
router.use("/", (req, res, next) => {
    res.contentType("application/json");
    next();
});

// Route that is accessed by all requests to check if the user is authenticated to the server
router.all(new RegExp("^(?!\/login$|\/register$).*"), (req, res, next) => {
    // Get token from headers
    const token = req.header('X-Access-Token') || req.header('Authorization');

    // Check if the user is authorized with a token, if so: pass to next routes, if not: return 401 NOT AUTHORIZED
    authentication.decodeToken(token, (error, payload) => {
        if (error) {
            console.log('Authentication error: ' + error.message);

            res.status((error.status || 401)).json("Not Authorised");
        } else {
            req.user = {
                userid: payload.sub,
                username: payload.username
            };
            next();
        }
    })
});

// Login route
router.post('/login', (req, res) => {
    // Get login info from request body
    const loginInfo = req.body;

    // Check if all the properties are present
    if (checkObjects.isValidLogin(loginInfo)) {
        res.status(412).json(new jsonModel("/api/login", "POST", 412, "Request body properties are invalid or missing"));
    } else {

        try {
            // Get the properties from the request body
            let username = loginInfo.username.trim().toLowerCase();
            let password = loginInfo.password.trim();

            // Call the login method to login to the api
            userRepo.login(username, password, "POST", res);
        } catch (error) {
            console.log(error);
        }
    }
});

// Registration route
router.post('/register', (req, res) => {
    const registerInfo = req.body;
    if (!checkObjects.isValidRegistration(registerInfo)) {
        res.status(412).json(new jsonModel("/api/register", "POST", 412, "Request body properties are invalid or missing"));
    } else {

        try {
            // Get the properties from the request body
            const username = registerInfo.username.trim().toLowerCase();
            const email = registerInfo.email.trim().toLowerCase();
            const password = registerInfo.password.trim();

            // Call the createUser method from the userRepo to create a new user
            userRepo.createUser(username, email, password, "POST", res);

        } catch (error) {
            console.log(error);
        }
    }
});

module.exports = router;