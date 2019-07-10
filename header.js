const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        // FORMAT OF TOKEN
        // Authorization: Bearer <access_token>
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            next();
        } else {
            console.log("Fdf");
            // Forbidden
            res.sendStatus(403);
        }
    },

    jwtVerify: (req, res) => {
        jwt.verify(req.token, 'secretkey', (err) => {
            if(err) {
                return res.status(403).json({ error: err.message });
            }
        });
    }
};