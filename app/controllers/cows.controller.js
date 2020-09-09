const db = require("../models");
const { symSign } = require("../models");
const cows = db.cows;
const cowAI_all = db.cowAI.cowAI_all;
const cowAI_currentLac = db.cowAI.cowAI_currentLac;
const cowLactation = db.cowLactation;
const cowMilkQuery = db.cowMilk.cowMilkQuery;
const cowSymptom = db.symSign.symSign;
const cowsFarm = db.cowsFarm;
const cowsFarmMilk = db.cowsFarmMilk;
const cowsFarmEvent = db.cowsFarmEvent;
const culling = db.culling.culling;
const cowActivity = db.cowAI.cowActivity;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    farmId: Joi.string().alphanum().min(3).max(10),
    idORcowName: Joi.string().min(1).max(30),
    cStatus: Joi.string().alphanum().min(2).max(2),
    cProductionStatus: Joi.string().alphanum().min(2).max(2),
    cMilkingStatus: Joi.string().alphanum().min(2).max(2),
    limitStart: Joi.number().integer(),
    limitEnd: Joi.number().integer(),
    ccowId: Joi.string().alphanum().min(4).max(15),
    ccowNo: Joi.number().integer(),
    cullTranId: Joi.number().integer(),
    farmFrom: Joi.string().alphanum().min(3).max(10),
    farmTo: Joi.string().alphanum().min(3).max(10),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
});

// Create and Save a new cows
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

        const cowSearch = {
            farmId: value.farmId,
            idORcowName: value.idORcowName,
            cStatus: value.cStatus,
            cProductionStatus: value.cProductionStatus,
            cMilkingStatus: value.cMilkingStatus,
            limitStart: value.limitStart,
            limitEnd: value.limitEnd
        };
        //var condition = null;
        var farmCondition = cowSearch.farmId ? { cFarmId: cowSearch.farmId } : null;
        var cowIdCondition = cowSearch.idORcowName ? { [Op.or]: [{ ccowId: { [Op.like]: `%${cowSearch.idORcowName}%` } }, { ccowName: { [Op.like]: `%${cowSearch.idORcowName}%` } }] } : null;
        //var cowNameCondition = cowSearch.idORcowName ? { ccowName: { [Op.like]: `%${cowSearch.idORcowName}%` } } : null;
        var cStatusCondition = cowSearch.cStatus ? { cStatus: cowSearch.cStatus } : null;
        var cProductionStatusCondition = cowSearch.cProductionStatus ? { cProductionStatus: cowSearch.cProductionStatus } : null;
        var cMilkingStatusCondition = cowSearch.cMilkingStatus ? { cMilkingStatus: cowSearch.cMilkingStatus } : null;
        var limitStartNum = cowSearch.limitStart ? parseInt(cowSearch.limitStart) : null;
        var limitEndNum = cowSearch.limitEnd ? parseInt(cowSearch.limitEnd) : null;

        await cowsFarm.findAll({
            offset: limitStartNum
            , limit: limitEndNum
            , attributes: ['ccowId'
                , 'ccowName'
                , 'cSex'
                , 'cAgeMonth'
                , 'cBirthDate'
                , 'cStatus'
                , 'cProductionStatus'
                , 'refProdStatusName'
                , 'cMilkingStatus'
                , 'cFarmId'
                , 'cLactation'
                , 'cNumOfService'
                , 'maDate'
                , 'maSemenId'
                , 'maTranId'
                , 'predictcvgDate'
                , 'countDownCVG'
                , 'predictdryDate'
                , 'countDownDRY'
                , 'cvgDate'
                , 'cAge'
                , 'gBodyConditionScore'
                , 'cSireId'
                , 'cDamId'
                , 'ccowNo'
                , 'eventName'
            ]
            , where: {
                [Op.and]: [
                    farmCondition
                    , cStatusCondition
                    , cProductionStatusCondition
                    , cMilkingStatusCondition
                    , cowIdCondition
                ]
            }
            , order: [['ccowId', 'DESC']],
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

exports.search_milkdata = async (req, res) => {
    if (!req.body) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const cowSearch = {
            farmId: value.farmId,
            idORcowName: value.idORcowName,
            cStatus: value.cStatus,
            cProductionStatus: value.cProductionStatus,
            cMilkingStatus: value.cMilkingStatus,
            limitStart: value.limitStart,
            limitEnd: value.limitEnd
        };
        //var condition = null;
        var farmCondition = cowSearch.farmId ? { cFarmId: cowSearch.farmId } : null;
        var cowIdCondition = cowSearch.idORcowName ? { [Op.or]: [{ ccowId: { [Op.like]: `%${cowSearch.idORcowName}%` } }, { ccowName: { [Op.like]: `%${cowSearch.idORcowName}%` } }] } : null;
        //var cowNameCondition = cowSearch.idORcowName ? { ccowName: { [Op.like]: `%${cowSearch.idORcowName}%` } } : null;
        var cStatusCondition = cowSearch.cStatus ? { cStatus: cowSearch.cStatus } : null;
        var cProductionStatusCondition = cowSearch.cProductionStatus ? { cProductionStatus: cowSearch.cProductionStatus } : null;
        var cMilkingStatusCondition = cowSearch.cMilkingStatus ? { cMilkingStatus: cowSearch.cMilkingStatus } : null;
        var limitStartNum = cowSearch.limitStart ? parseInt(cowSearch.limitStart) : null;
        var limitEndNum = cowSearch.limitEnd ? parseInt(cowSearch.limitEnd) : null;

        await cowsFarmMilk.findAll({
            attributes: ['ccowId'
                , 'ccowName'
                , 'cSex'
                , 'cAgeMonth'
                , 'cBirthDate'
                , 'cStatus'
                , 'cProductionStatus'
                , 'cMilkingStatus'
                , 'cFarmId'
                , 'cLactation'
                , 'cNumOfService'
                , 'cAge'
                , 'cvgDate'
                , 'cvgTranId'
                , 'milkTranId'
                , 'collectDate'
                , 'milk1'
                , 'milk2'
                , 'ccowNo'
                , 'numMilkKeep'
                , 'cvCalveSex'
                , 'DIM'
            ]
            , where: {
                [Op.and]: [
                    farmCondition
                    , cStatusCondition
                    , cProductionStatusCondition
                    , cMilkingStatusCondition
                    , cowIdCondition
                ]
            }
            , order: [['ccowId', 'DESC']],
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

// Retrieve all cows from the database.
exports.findAll = async (req, res) => {
    const farmId = req.query.farmId;
    //var condition = null;

    var condition = farmId ? { cFarmId: farmId } : null;

    await cowsFarm.findAll({
        attributes: ['ccowId'
            , 'ccowName'
            , 'cSex'
            , 'cAgeMonth'
            , 'cBirthDate'
            , 'cStatus'
            , 'cProductionStatus'
            , 'refProdStatusName'
            , 'cMilkingStatus'
            , 'cFarmId'
            , 'cLactation'
            , 'cNumOfService'
            , 'maDate'
            , 'maSemenId'
            , 'maTranId'
            , 'predictcvgDate'
            , 'countDownCVG'
            , 'predictdryDate'
            , 'countDownDRY'
            , 'cvgDate'
            , 'cAge'
            , 'gBodyConditionScore'
            , 'cSireId'
            , 'cDamId'
            , 'ccowNo'
            , 'eventName'
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
                    err.message || "Some error occurred while retrieving cowsFarm."
            });
        });
};

exports.findAll_milk = async (req, res) => {
    const farmId = req.query.farmId;
    //var condition = null;

    var condition = farmId ? { cFarmId: farmId } : null;

    await cowsFarmMilk.findAll({
        attributes: ['ccowId'
            , 'ccowName'
            , 'cSex'
            , 'cAgeMonth'
            , 'cBirthDate'
            , 'cStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'cFarmId'
            , 'cLactation'
            , 'cNumOfService'
            , 'cAge'
            , 'cvgDate'
            , 'cvgTranId'
            , 'milkTranId'
            , 'collectDate'
            , 'milk1'
            , 'milk2'
            , 'ccowNo'
            , 'numMilkKeep'
            , 'cvCalveSex'
            , 'DIM'
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
                    err.message || "Some error occurred while retrieving cowsFarm."
            });
        });
};

exports.findAll_event = async (req, res) => {
    const eventId = req.query.eventId;
    //var condition = null;
    var eventCon = eventId ? { eventId: eventId } : null;

    if (req.query.farmId) {
        var condition = eventId ? {
            cFarmId: req.query.farmId, eventId: eventId
        } : {
                cFarmId: req.query.farmId
            };
    }
    else if (req.query.staffId) {
        var condition = eventId ? {
            maStaffId: req.query.staffId, eventId: eventId
        } : {
                maStaffId: req.query.staffId
            };
    } else {
        res.status(401).json({
            error: true,
            message:
                "Condition false."
        });
    }

    await cowsFarmEvent.findAll({
        attributes: ['ccowId'
            , 'ccowName'
            , 'cBirthDate'
            , 'cStatus'
            , 'cProductionStatus'
            , 'refProdStatusName'
            , 'cMilkingStatus'
            , 'cvgDate'
            , 'maLactation'
            , 'maNumberOfServiceInCurrLact'
            , 'maDate'
            , 'predictcvgDate'
            , 'countDownCVG'
            , 'predictdryDate'
            , 'countDownDRY'
            , 'eventId'
            , 'eventName'
            , 'cFarmId'
            , 'maStaffId'
            , 'ccowNo'
        ]
        , where: condition
        , order: [
            ['eventId', 'ASC']
        ]
    })
        .then(data => {
            //console.log(res.user);
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message:
                    err.message || "Some error occurred while retrieving cowsFarm."
            });
        });
};

// Find a single cows with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { ccowId: id };
    /*cows.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await cows.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'ccowName'
            , 'cSex'
            , 'cBreedDetail'
            , 'fFarmId'
            , 'fName'
            , 'cAgeMonth'
            , 'cFirstBreed'
            , 'cSireId'
            , 'sireBreed'
            , 'cDamId'
            , 'damBreed'
            , 'cBirthDate'
            , 'cSource'
            , 'cDateJoiningHerd'
            , 'cStatus'
            , 'ccullingStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'cActiveFlag'
            , 'cLactation'
            , 'cNumOfService'
            , 'confirmStatus'
            , 'censusStatus'
            , 'runBreedStatus'
            , 'refCStatusName'
            , 'refProdStatusName'
            , 'refMilkStatusName'
            , 'refCullStatusName'
            , 'refCowSourceName'
            , 'rfid'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving cows with id=" + id
            });
        });
};

// Find a single cows with an id
exports.findOne_ai = async (req, res) => {
    const id = req.params.id;
    var condition = { ccowId: id };
    /*cows.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await cowAI_currentLac.findAll({
        attributes: ['ccowNo'
            , 'maTranId'
            , 'maLactation'
            , 'maNumberOfServiceInCurrLact'
            , 'maDate'
            , 'pcCheckDate'
            , 'cvgDate'
            , 'maSemenId'
            , 'maResult'
            , 'maResultName'
            , 'ccowId'
            , 'maStaffId'
            , 'cFarmId'
            , 'cLactation'
            , 'cNumOfService'
            , 'gBodyConditionScore'
            , 'maPregResult'
            , 'maPregResultName'
        ]
        , where: condition
        , order: [
            ['maDate', 'DESC']
        ]
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving cow last ai with id=" + id
            });
        });
};

exports.findOne_lactation = async (req, res) => {
    const id = req.params.id;
    var condition = { ccowId: id };

    await cowLactation.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'cvgLacNo'
            , 'cvgDate'
            , 'cvCalveSex'
            , 'dryDate'
            , 'cvgTranId'
        ]
        , where: condition
        , order: [
            ['cvgLacNo', 'DESC']
        ]
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving cowLactation with id=" + id
            });
        });
};

exports.findOne_milk = async (req, res) => {
    const id = req.params.id;
    var condition = { ccowId: id };

    await cowMilkQuery.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'cvgTranId'
            , 'cvgLacNo'
            , 'cvgDate'
            , 'milkTranId'
            , 'farmId'
            , 'collectDate'
            , 'milk1'
            , 'milk2'
        ]
        , where: condition
        , order: [
            ['collectDate', 'ASC']
        ]
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving cowMilk with id=" + id
            });
        });
};

exports.findOne_symptom = async (req, res) => {
    const id = req.params.id;
    var condition = { ccowId: id };

    await cowSymptom.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'ccowName'
            , 'cBirthDate'
            , 'cFarmId'
            , 'cLactation'
            , 'symptomSignTranId'
            , 'refSymtomId'
            , 'refSymtomName'
            , 'refSymtomGroup'
            , 'symptomSignDate'
            , 'symptomFarmId'
            , 'symDateUpdate'
        ]
        , where: condition
        , order: [
            ['symptomSignDate', 'ASC']
        ]
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving cowSymptom with id=" + id
            });
        });
};


// Update a org by the id in the request
exports.update = (req, res) => {

};

// Delete a cows with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all cows from the database.
exports.deleteAll = (req, res) => {

};

// Find all published cows
exports.findAllPublished = (req, res) => {

};