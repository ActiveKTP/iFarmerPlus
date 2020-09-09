const db = require("../models");
const users = db.users;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const keyConfig = require("../config/key.config.js");

// Create and Save a new users
exports.create = (req, res) => {
    res.send(req.body);
};

// Find a single users with an id
exports.login = async (req, res) => {
    //res.send(req.body);
    const { username, password } = req.body;
    var condition = { USER_NAME: username, PASSWORD: password };
    if (username && password) {
        await users.findAll({
            attributes: ['USER_NAME', 'USER_DESCRIPTION', 'EMP_ID', 'PERMISSIONS', 'db_id'
                , 'StaffFullName', 'staffOrgId']
            , where: condition
        }).then(data => {
            if (data == '') { res.status(401).json({ error: true, message: "Account not found", check: 0 }); }
            else {
                //Create and assign a token
                const token = jwt.sign({ _id: username }, keyConfig.TOKEN_SECRET_iFarmerPlus)
                res.header('auth-token', token).json(data);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving users"
                });
            });
    } else res.json({ error: true, message: "Not found data" })
};

// Find a single users with an id
exports.findOne = async (req, res) => {
    res.send(req.body);
};

// Retrieve all users from the database.
exports.findAll = async (req, res) => {
    res.send(req.body);
};

// Update a users by the id in the request
exports.update = (req, res) => {

};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all users from the database.
exports.deleteAll = (req, res) => {

};

// Find all published users
exports.findAllPublished = (req, res) => {

};