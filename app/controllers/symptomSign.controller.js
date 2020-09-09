const db = require("../models");
const symSign = db.symSign.symSign;
const symSign_last = db.symSign.symSign_last;
const cows = db.cows;
//const calving = db.calving.calving;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');
//console.log(new Date().getFullYear());
//console.log(new Date().getMonth() + 1);
//console.log(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());

const schema = Joi.object({
    ccowId: Joi.string().alphanum().min(4).max(15),
    ccowNo: Joi.number().integer(),
    symptomSignDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    symptomSignDate_month: Joi.number().integer().min(1).max(12),
    symptomSignDate_day: Joi.number().integer().min(1).max(31),
    symptomId: Joi.string().alphanum().min(4).max(4),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    cLactation: Joi.number().integer().min(0).max(12),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    symptomSignTranId: Joi.number().integer(),
});

// Create and Save a new symSign
exports.create = (req, res) => {

};

// Insert a single symSign
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const SympSign = {
            ccowId: value.ccowId,
            ccowNo: value.ccowNo,
            symptomSignDate: value.symptomSignDate_month + '/' + value.symptomSignDate_day + '/' + value.symptomSignDate_year,
            refSymptomId: value.symptomId,
            symptomLactation: value.cLactation,
            symptomFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            symptomSignTranId: null
        };

        var condition = {
            ccowNo: SympSign.ccowNo
        };

        await cows.findAll({
            attributes: ['ccowNo', 'cLactation']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลโค", check: 0 });
            }
            else {
                const tranText = JSON.stringify(value);
                insertSympSign(SympSign, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving SympSign"
                });
            });
    }

};
async function insertSympSign(SympSign, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_SympSign_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: SympSign.ccowId, param2: SympSign.ccowNo, param3: SympSign.symptomSignDate, param4: SympSign.refSymptomId
                , param5: SympSign.symptomLactation, param6: SympSign.symptomFarmId, param7: SympSign.user_updated
                , param8: SympSign.symptomSignTranId, param9: tranText
            },
            type: db.sequelize.QueryTypes.SELECT
        })
        .then((result) => {
            console.log('resultValues', result);
            res.json(result[0]);
            //return result[0];
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err.message
            });
        });
}

// Retrieve all SympSign from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
        await symSign.findAll({
            limit: 1
            , attributes: ['ccowNo'
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
            , order: [['symptomSignTranId', 'DESC']]
        })
            .then(data => {
                //console.log(res.user);
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message:
                        err.message || "Some error occurred while retrieving SympSign."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single SympSign with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { symptomSignTranId: id };
    /*SympSign.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await symSign.findAll({
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
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving SympSign with symptomSignTranId=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.symptomSignTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const SympSign = {
            ccowId: value.ccowId,
            ccowNo: value.ccowNo,
            symptomSignDate: value.symptomSignDate_month + '/' + value.symptomSignDate_day + '/' + value.symptomSignDate_year,
            refSymptomId: value.symptomId,
            symptomLactation: value.cLactation,
            symptomFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            symptomSignTranId: value.symptomSignTranId
        };

        var condition = {
            ccowNo: SympSign.ccowNo, symptomSignTranId: SympSign.symptomSignTranId
        };

        await symSign.findAll({
            attributes: ['ccowNo', 'cLactation', 'symptomSignDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลป่วยของโค", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updateSympSign(SympSign, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving SympSign"
                });
            });
    }
};
async function updateSympSign(SympSign, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_SympSign_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: SympSign.ccowId, param2: SympSign.ccowNo, param3: SympSign.symptomSignDate, param4: SympSign.refSymptomId
                , param5: SympSign.symptomLactation, param6: SympSign.symptomFarmId, param7: SympSign.user_updated
                , param8: SympSign.symptomSignTranId, param9: tranText
            },
            type: db.sequelize.QueryTypes.SELECT
        })
        .then((result) => {
            console.log('resultValues', result);
            res.json(result[0]);
            //return result[0];
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err.message
            });
        });
}

/*// Delete a SympSign with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    SympSign.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "SympSign was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete SympSign with maTranId=${id}. Maybe SympSign was not found!`,
                    check: 0
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};*/

// Delete all SympSign from the database.
exports.delete = async (req, res) => {
    if (!req.body.symptomSignTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const SympSign = {
            ccowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            symptomSignTranId: value.symptomSignTranId,
        };

        var condition = { symptomSignTranId: SympSign.symptomSignTranId };

        await symSign.findAll({
            attributes: ['ccowNo', 'cLactation', 'symptomSignDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลป่วยของโค", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                deleteSympSign(SympSign, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving SympSign"
                });
            });
    }
};
async function deleteSympSign(SympSign, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_SympSign_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: SympSign.symptomSignTranId, param2: SympSign.user_updated, param3: tranText, param4: SympSign.ccowNo
            },
            type: db.sequelize.QueryTypes.SELECT
        })
        .then((result) => {
            console.log('resultValues', result);
            res.json(result[0]);
            //return result[0];
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: err.message
            });
        });
}


// Find all published SympSign
exports.findAllPublished = (req, res) => {

};