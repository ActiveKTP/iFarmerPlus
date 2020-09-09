const db = require("../models");
const pregnancy = db.pregnancyCheck.pregnancyCheck;
const pregView = db.pregnancyCheck.pregView;
const mating = db.mating;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');
//console.log(new Date().getFullYear());
//console.log(new Date().getMonth() + 1);
//console.log(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());

const schema = Joi.object({
    ccowId: Joi.string().alphanum().min(4).max(15),
    ccowNo: Joi.number().integer(),
    pcCheckDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    pcCheckDate_month: Joi.number().integer().min(1).max(12),
    pcCheckDate_day: Joi.number().integer().min(1).max(31),
    pcCheckMethod: Joi.string().alphanum().min(2).max(2),
    pcCheckResult: Joi.string().alphanum().min(2).max(2),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    maTranId: Joi.number().integer(),
});

// Create and Save a new pregnancy
exports.create = (req, res) => {

};

// Insert a single pregnancy
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Pregnancy = {
            ccowId: value.ccowId,
            pcCowNo: value.ccowNo,
            pcCheckDate: value.pcCheckDate_month + '/' + value.pcCheckDate_day + '/' + value.pcCheckDate_year,
            pcCheckMethod: value.pcCheckMethod,
            pcCheckResult: value.pcCheckResult,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            pcMaTranId: value.maTranId
        };

        var condition = {
            macowNo: Pregnancy.pcCowNo, maTranId: Pregnancy.pcMaTranId
        };

        await mating.findAll({
            attributes: ['macowNo', 'maLactation', 'maNumberOfServiceInCurrLact', 'maDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการผสม", check: 0 });
            }
            else {
                const tranText = JSON.stringify(value);
                insertPregnancy(Pregnancy, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving pregnancy"
                });
            });
    }

};
async function insertPregnancy(Pregnancy, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_PG_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Pregnancy.pcCowNo, param2: Pregnancy.pcMaTranId, param3: Pregnancy.pcCheckDate, param4: Pregnancy.pcCheckResult
                , param5: Pregnancy.pcCheckMethod, param6: Pregnancy.user_updated
                , param7: Pregnancy.ccowId, param8: tranText, param9: Pregnancy.cFarmId
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

// Retrieve all Pregnancy from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    //console.log(condition);
    if (condition) {
        await pregView.findAll({
            attributes: ['ccowNo'
                , 'ccowId'
                , 'maLactation'
                , 'maNumberOfServiceInCurrLact'
                , 'maDate'
                , 'maSemenId'
                , 'pcCheckDate'
                , 'pcCheckResult'
                , 'pcStaffId'
                , 'maTranId'
                , 'pcCheckMethod'
                , 'cStatus'
                , 'cProductionStatus'
                , 'cMilkingStatus'
                , 'cFarmId'
                , 'pcDateUpdate'
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
                        err.message || "Some error occurred while retrieving Pregnancy."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single Pregnancy with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { maTranId: id };
    /*Pregnancy.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await pregView.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'maLactation'
            , 'maNumberOfServiceInCurrLact'
            , 'maDate'
            , 'maSemenId'
            , 'pcCheckDate'
            , 'pcCheckResult'
            , 'pcStaffId'
            , 'maTranId'
            , 'pcCheckMethod'
            , 'cStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'cFarmId'
            , 'pcDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving Pregnancy with maTranId=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Pregnancy = {
            ccowId: value.ccowId,
            pcCowNo: value.ccowNo,
            pcCheckDate: value.pcCheckDate_month + '/' + value.pcCheckDate_day + '/' + value.pcCheckDate_year,
            pcCheckMethod: value.pcCheckMethod,
            pcCheckResult: value.pcCheckResult,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            pcMaTranId: value.maTranId
        };

        var condition = { pcMaTranId: Pregnancy.pcMaTranId };

        await pregnancy.findAll({
            attributes: ['pcCowNo', 'pcMaTranId', 'pcCheckDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการตรวจท้อง", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updatePregnancy(Pregnancy, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Pregnancy"
                });
            });
    }
};
async function updatePregnancy(Pregnancy, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_PG_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Pregnancy.pcCowNo, param2: Pregnancy.pcMaTranId, param3: Pregnancy.pcCheckDate, param4: Pregnancy.pcCheckResult
                , param5: Pregnancy.pcCheckMethod, param6: Pregnancy.user_updated
                , param7: Pregnancy.ccowId, param8: tranText, param9: Pregnancy.cFarmId
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

/*// Delete a Pregnancy with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Pregnancy.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Pregnancy was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete Pregnancy with maTranId=${id}. Maybe Pregnancy was not found!`,
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

// Delete all Pregnancy from the database.
exports.delete = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Pregnancy = {
            pcCowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            pcMaTranId: value.maTranId,
        };

        var condition = { pcMaTranId: Pregnancy.pcMaTranId };

        await pregnancy.findAll({
            attributes: ['pcCowNo', 'pcMaTranId', 'pcCheckDate']
            , where: condition
        }).then(data => {
            if (data == '') {

                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการตรวจท้อง", check: 0 });

            }
            else {

                const tranText = JSON.stringify(value);
                deletePregnancy(Pregnancy, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Pregnancy"
                });
            });
    }
};
async function deletePregnancy(Pregnancy, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_PG_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Pregnancy.pcMaTranId, param2: Pregnancy.user_updated, param3: tranText, param4: Pregnancy.pcCowNo
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


// Find all published Pregnancy
exports.findAllPublished = (req, res) => {

};