const db = require("../models");
const semen = db.semens;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    sSemenId: Joi.string().min(1).max(15),
    animalType: Joi.number().integer(),
    limit: Joi.number().integer(),
});

// Create and Save a new semen
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

        const semenSearch = {
            sSemenId: value.sSemenId,
            animalType: value.animalType,
            limit: value.limit
        };
        //var condition = null;
        var condition = semenSearch.animalType ? { animalType: semenSearch.animalType } : null;
        var semenCondition = semenSearch.sSemenId ? { sSemenId: { [Op.like]: `%${semenSearch.sSemenId}%` } } : null;
        var semenConditionNotxy = { sSemenId: { [Op.notLike]: `%xy%` } }
        var limitNum = semenSearch.limit ? parseInt(semenSearch.limit) : null;

        await semen.findAll({
            //offset: 0
            limit: limitNum
            , attributes: ['ccowNo', 'ccowId', 'ccowName', 'cBirthDate', 'refCountryName'
                , 'refSemenSrcName', 'sSemenId', 'cbBreedDetail', 'animalType']
            , where: {
                [Op.and]: [
                    condition,
                    semenCondition,
                    semenConditionNotxy,
                ]
            }
            , order: [['sSemenId', 'DESC']],
        })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message:
                        err.message || "Some error occurred while retrieving semens."
                });
            });
    }
};

// Retrieve all semens from the database.
exports.findAll = async (req, res) => {
    const animalType = req.query.animalType;
    const sSemenId = req.query.sSemenId;
    const limit = req.query.limit;
    //var condition = null;
    var condition = animalType ? { animalType: animalType } : null;
    var semenCondition = sSemenId ? { sSemenId: { [Op.like]: `%${sSemenId}%` } } : null;
    var semenConditionNotxy = { sSemenId: { [Op.notLike]: `%xy%` } }
    var limitNum = limit ? parseInt(limit) : null;

    await semen.findAll({
        //offset: 0
        limit: limitNum
        , attributes: ['ccowNo', 'ccowId', 'ccowName', 'cBirthDate', 'refCountryName'
            , 'refSemenSrcName', 'sSemenId', 'cbBreedDetail', 'animalType']
        , where: {
            [Op.and]: [
                condition,
                semenCondition,
                semenConditionNotxy,
            ]
        }
        , order: [['sSemenId', 'DESC']],
    })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message:
                    err.message || "Some error occurred while retrieving semens."
            });
        });
};

// Find a single semen with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { sSemenId: id };
    /*semen.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await semen.findAll({
        attributes: ['ccowNo', 'ccowId', 'ccowName', 'cBirthDate', 'refCountryName'
            , 'refSemenSrcName', 'sSemenId', 'cbBreedDetail', 'animalType']
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving semen with id=" + id
            });
        });
};

// Update a semen by the id in the request
exports.update = (req, res) => {

};

// Delete a semen with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all semens from the database.
exports.deleteAll = (req, res) => {

};

// Find all published semens
exports.findAllPublished = (req, res) => {

};