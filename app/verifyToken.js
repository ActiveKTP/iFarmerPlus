const jwt = require('jsonwebtoken');
const keyConfig = require("./config/key.config.js");

module.exports = function (req, res, next) {
    if (!req.headers.authorization) return res.status(401).send('Access Denied');

    try {
        console.log(req.headers.authorization)
        const verified = jwt.verify(req.headers.authorization.split(' ')[1], keyConfig.TOKEN_SECRET_iFarmerPlus);
        //req.user = verified;
        console.log(verified);
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}