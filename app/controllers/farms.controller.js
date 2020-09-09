const db = require("../models");
const farms = db.farms;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    idORfarmName: Joi.string().min(1).max(30),
    limit: Joi.number().integer(),
});

// Create and Save a new farms
exports.create = (req, res) => {

};

exports.search = async (req, res) => {
    if (!req.body) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const farmSearch = {
            idORfarmName: value.idORfarmName,
            limit: value.limit
        };
        //var condition = null;
        var farmIdCondition = farmSearch.idORfarmName ? { fFarmId: { [Op.like]: `%${farmSearch.idORfarmName}%` } } : null;
        var farmNameCondition = farmSearch.idORfarmName ? { fName: { [Op.like]: `%${farmSearch.idORfarmName}%` } } : null;
        var limitNum = farmSearch.limit ? parseInt(farmSearch.limit) : null;

        await farms.findAll({
            //offset: 0
            limit: limitNum
            , attributes: ['fFarmId'
                , 'fName'
                , 'refTumbolName'
                , 'refAmphurName'
                , 'refProvinceName'
                , 'foName'
                , 'foLastName'
                , 'fAddress'
                , 'foIdCard'
                , 'fMobileNo'
                , 'fXPoint'
                , 'fYPoint'
                , 'refFStatusName'
                , 'fStatus'
                , 'foFullName'
                , 'fRegisterDate'
            ]
            , where: {
                [Op.or]: [
                    farmIdCondition,
                    farmNameCondition
                ]
            }
            , order: [['fFarmId', 'DESC']],
        })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message:
                        err.message || "Some error occurred while retrieving farms."
                });
            });
    }
};

// Retrieve all farms from the database.
exports.findAll = async (req, res) => {
    const title = req.query.title;
    //var condition = null;

    var condition = title ? { fName: { [Op.like]: `%${title}%` } } : null;

    await farms.findAll({
        attributes: ['fFarmId'
            , 'fName'
            , 'refTumbolName'
            , 'refAmphurName'
            , 'refProvinceName'
            , 'foName'
            , 'foLastName'
            , 'fAddress'
            , 'foIdCard'
            , 'fMobileNo'
            , 'fXPoint'
            , 'fYPoint'
            , 'refFStatusName'
            , 'fStatus'
            , 'foFullName'
            , 'fRegisterDate'
        ]
        , where: condition
    })
        .then(data => {
            //console.log(res.user);
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message:
                    err.message || "Some error occurred while retrieving farms."
            });
        });
};


// Find a single farms with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { fFarmId: id };
    /*farms.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await farms.findAll({
        attributes: ['fFarmId'
            , 'fName'
            , 'refTumbolName'
            , 'refAmphurName'
            , 'refProvinceName'
            , 'foName'
            , 'foLastName'
            , 'fAddress'
            , 'foIdCard'
            , 'fMobileNo'
            , 'fXPoint'
            , 'fYPoint'
            , 'refFStatusName'
            , 'fStatus'
            , 'foFullName'
            , 'fRegisterDate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving farms with id=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = (req, res) => {

};

// Delete a farms with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all farms from the database.
exports.deleteAll = (req, res) => {

};

// Find all published farms
exports.findAllPublished = (req, res) => {

};