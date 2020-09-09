const db = require("../models");
const pcCheckMethod = db.ref.pcCheckMethod;
const pcCheckResult = db.ref.pcCheckResult;
const cvgParturition = db.ref.cvgParturition;
const cvgCalvingAsst = db.ref.cvgCalvingAsst;
const cvgCalvingResult = db.ref.cvgCalvingResult;
const dryReason = db.ref.dryReason;
const abAbortionResult = db.ref.abAbortionResult;
const RefSymtom = db.ref.RefSymtom;
const cullType = db.ref.cullType;
const cullCause = db.ref.cullCause;
const eventCow = db.ref.eventCow;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    refSymtomName: Joi.string().min(1).max(30),
    limit: Joi.number().integer(),
});


// Create and Save a new ref
exports.create = (req, res) => {

};


exports.search_refSymptom = async (req, res) => {
    if (!req.body) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const refSymptomSearch = {
            refSymtomName: value.refSymtomName,
            limit: value.limit
        };
        //var condition = null;
        var conondition = refSymptomSearch.refSymtomName ? { refSymtomName: { [Op.like]: `%${refSymptomSearch.refSymtomName}%` } } : null;
        var limitNum = refSymptomSearch.limit ? parseInt(refSymptomSearch.limit) : null;

        await RefSymtom.findAll({
            //offset: 0
            limit: limitNum
            , attributes: ['refSymtomId'
                , 'refSymtomName'
            ]
            , where: conondition
            , order: [['refSymtomId', 'DESC']],
        })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message:
                        err.message || "Some error occurred while retrieving RefSymtom."
                });
            });
    }
};

// Retrieve all refs from the database.
exports.findAll = async (req, res) => {

};

// Find a single ref with an id
exports.findOne_pcCheckMethod = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await pcCheckMethod.findAll({
        attributes: ['refPregChkId'
            , 'refPregChkName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_pcCheckResult = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await pcCheckResult.findAll({
        attributes: ['refPregResultId'
            , 'refPregResultName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_cvgParturition = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await cvgParturition.findAll({
        attributes: ['refParturitionId'
            , 'refParturitionName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_cvgCalvingAsst = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await cvgCalvingAsst.findAll({
        attributes: ['refCalvAsId'
            , 'refCalvAsName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_cvgCalvingResult = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await cvgCalvingResult.findAll({
        attributes: ['refCalvResultId'
            , 'refCalvResultName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_dryReason = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await dryReason.findAll({
        attributes: ['refdryReasonId'
            , 'refdryReasonName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_abAbortionResult = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await abAbortionResult.findAll({
        attributes: ['refAbortResultId'
            , 'refAbortResultName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findOne_refSymptom = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await RefSymtom.findAll({
        attributes: ['refSymtomId'
            , 'refSymtomName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findAll_cullType = async (req, res) => {
    //const id = req.params.id;
    //var condition = { orgCode: id };
    await cullType.findAll({
        attributes: ['refCullStatusId'
            , 'refCullStatusName'
        ]
        //, where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findAll_cullCause = async (req, res) => {
    const cullType = req.query.cullType;
    if (cullType == 'DE') var refCullDied = '1';
    else var refCullDied = '0';
    //var condition = null;
    var condition = refCullDied ? { refCullDied: refCullDied } : null;
    await cullCause.findAll({
        attributes: ['refCullId'
            , 'refCullName'
        ]
        , where: condition
        /*, order: [
            ['maDate', 'DESC']
        ]*/
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

exports.findAll_eventCow = async (req, res) => {
    //var condition = null;
    //var condition = eventId ? { eventId: eventId } : null;
    await eventCow.findAll({
        attributes: ['eventId'
            , 'eventName'
        ]
        //, where: condition
        , order: [
            ['eventId', 'ASC']
        ]
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving from Ref."
            });
        });
};

// Update a ref by the id in the request
exports.update = (req, res) => {

};

// Delete a ref with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all refs from the database.
exports.deleteAll = (req, res) => {

};

// Find all published refs
exports.findAllPublished = (req, res) => {

};