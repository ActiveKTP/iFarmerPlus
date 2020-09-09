const db = require("../models");
const abortion = db.abortion.abortion;
const abortionView = db.abortion.abortionView;
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
    abortionDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    abortionDate_month: Joi.number().integer().min(1).max(12),
    abortionDate_day: Joi.number().integer().min(1).max(31),
    abAbortResult: Joi.string().alphanum().min(2).max(2),
    //maLactation: Joi.number().integer().min(0).max(12),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    maTranId: Joi.number().integer(),
});

// Create and Save a new abortion
exports.create = (req, res) => {

};

// Insert a single abortion
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Abortion = {
            ccowId: value.ccowId,
            abCowNo: value.ccowNo,
            abAbortDate: value.abortionDate_month + '/' + value.abortionDate_day + '/' + value.abortionDate_year,
            abAbortResult: value.abAbortResult,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            abMaTranId: value.maTranId
        };

        var condition = {
            macowNo: Abortion.abCowNo, maTranId: Abortion.abMaTranId
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
                insertAbortion(Abortion, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Abortion"
                });
            });
    }

};
async function insertAbortion(Abortion, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_AB_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Abortion.ccowId, param2: Abortion.abCowNo, param3: Abortion.abMaTranId, param4: Abortion.abAbortDate
                , param5: Abortion.user_updated, param6: tranText
                , param7: Abortion.cFarmId, param8: Abortion.abAbortResult
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

// Retrieve all Abortion from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
        await abortionView.findAll({
            attributes: ['maLactation'
                , 'maNumberOfServiceInCurrLact'
                , 'maDate'
                , 'maSemenId'
                , 'maTranId'
                , 'abAbortDate'
                , 'abStaffId'
                , 'maPregResult'
                , 'abAbortStatus'
                , 'abAbortResult'
                , 'ccowNo'
                , 'ccowId'
                , 'cStatus'
                , 'cProductionStatus'
                , 'cMilkingStatus'
                , 'cFarmId'
                , 'abDateUpdate'
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
                        err.message || "Some error occurred while retrieving Abortion."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single Abortion with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { maTranId: id };
    /*Abortion.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await abortionView.findAll({
        attributes: ['maLactation'
            , 'maNumberOfServiceInCurrLact'
            , 'maDate'
            , 'maSemenId'
            , 'maTranId'
            , 'abAbortDate'
            , 'abStaffId'
            , 'maPregResult'
            , 'abAbortStatus'
            , 'abAbortResult'
            , 'ccowNo'
            , 'ccowId'
            , 'cStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'cFarmId'
            , 'abDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving Abortion with maTranId=" + id
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

        const Abortion = {
            ccowId: value.ccowId,
            abCowNo: value.ccowNo,
            abAbortDate: value.abortionDate_month + '/' + value.abortionDate_day + '/' + value.abortionDate_year,
            abAbortResult: value.abAbortResult,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            abMaTranId: value.maTranId
        };

        var condition = { abMaTranId: Abortion.abMaTranId };

        await abortion.findAll({
            attributes: ['abCowNo', 'abMaTranId', 'abAbortDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการแท้ง", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updateAbortion(Abortion, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Abortion"
                });
            });
    }
};
async function updateAbortion(Abortion, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_AB_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Abortion.ccowId, param2: Abortion.abCowNo, param3: Abortion.abMaTranId, param4: Abortion.abAbortDate
                , param5: Abortion.user_updated, param6: tranText
                , param7: Abortion.cFarmId, param8: Abortion.abAbortResult
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

/*// Delete a Abortion with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Abortion.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Abortion was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete Abortion with maTranId=${id}. Maybe Abortion was not found!`,
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

// Delete all Abortion from the database.
exports.delete = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Abortion = {
            abCowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            abMaTranId: value.maTranId,
        };

        var condition = { abMaTranId: Abortion.abMaTranId };

        await abortion.findAll({
            attributes: ['abCowNo', 'abMaTranId', 'abAbortDate']
            , where: condition
        }).then(data => {
            if (data == '') {

                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการแท้ง", check: 0 });

            }
            else {

                const tranText = JSON.stringify(value);
                deleteAbortion(Abortion, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Abortion"
                });
            });
    }
};
async function deleteAbortion(Abortion, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_AB_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Abortion.abMaTranId, param2: Abortion.user_updated, param3: tranText, param4: Abortion.abCowNo
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


// Find all published Abortion
exports.findAllPublished = (req, res) => {

};