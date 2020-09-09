const db = require("../models");
const mating = db.mating;
const cowsFarm = db.cowsFarm;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');
//console.log(new Date().getFullYear());
//console.log(new Date().getMonth() + 1);
//console.log(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());

const schema = Joi.object({
    ccowNo: Joi.number().integer(),
    maDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    maDate_month: Joi.number().integer().min(1).max(12),
    maDate_day: Joi.number().integer().min(1).max(31),
    maLactation: Joi.number().integer().min(0).max(12),
    maNumberOfServiceInCurrLact: Joi.number().integer().min(1).max(20),
    maSemenId: Joi.string().alphanum().min(3).max(15),
    maSemenDose: Joi.number().integer().min(1).max(3),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    //maStaffId: Joi.string().alphanum().min(3).max(15),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    maTranId: Joi.number().integer(),
});

// Create and Save a new mating
exports.create = (req, res) => {

};

// Insert a single mating
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Mating = {
            macowNo: value.ccowNo,
            macomaMatingMethodwNo: 'AI',
            maDate: value.maDate_month + '/' + value.maDate_day + '/' + value.maDate_year,
            maLactation: value.maLactation,
            maNumberOfServiceInCurrLact: value.maNumberOfServiceInCurrLact,
            maSemenId: value.maSemenId,
            maSemenDose: value.maSemenDose,
            cFarmId: value.cFarmId,
            //maStaffId: value.maStaffId,
            user_updated: value.USER_NAME,
        };

        var condition = {
            [Op.or]: [
                { macowNo: Mating.macowNo, maLactation: Mating.maLactation, maNumberOfServiceInCurrLact: Mating.maNumberOfServiceInCurrLact },
                { macowNo: Mating.macowNo, maDate: Mating.maDate }
            ]
        };

        await mating.findAll({
            attributes: ['macowNo', 'maLactation', 'maNumberOfServiceInCurrLact', 'maDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                const tranText = JSON.stringify(value);
                insertMating(Mating, tranText, res);
                //res.json(result[0]);
            }
            else {
                res.status(401).json({ error: true, message: "รอบการให้นมและครั้งที่ผสมหรือวันที่ผสมซ้ำกับข้อมูลที่มีในระบบ", check: 1 });
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving mating"
                });
            });
    }

};
async function insertMating(Mating, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_AI_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 ;  SELECT @RESULT AS maTranId ;',
        {
            replacements: {
                param1: Mating.macowNo, param2: Mating.macomaMatingMethodwNo, param3: Mating.maDate, param4: Mating.maLactation
                , param5: Mating.maNumberOfServiceInCurrLact, param6: Mating.maSemenId, param7: Mating.maSemenDose, param8: Mating.cFarmId
                , param9: Mating.user_updated, param10: tranText
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

// Retrieve all mating from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
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
                , 'maDateUpdate'
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
                        err.message || "Some error occurred while retrieving mating."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false.."
        });
    }
};

// Find a single mating with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { maTranId: id };
    /*mating.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
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
            , 'maDateUpdate'

        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving mating with id=" + id
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

        const Mating = {
            macowNo: value.ccowNo,
            macomaMatingMethodwNo: 'AI',
            maDate: value.maDate_month + '/' + value.maDate_day + '/' + value.maDate_year,
            //maLactation: value.maLactation,
            //maNumberOfServiceInCurrLact: value.maNumberOfServiceInCurrLact,
            maSemenId: value.maSemenId,
            maSemenDose: value.maSemenDose,
            //cFarmId: value.cFarmId,
            //maStaffId: value.maStaffId,
            user_updated: value.USER_NAME,
            maTranId: value.maTranId,
        };

        var condition = {
            macowNo: Mating.macowNo, maDate: Mating.maDate
            , maTranId: { [Op.ne]: Mating.maTranId }
        };

        await mating.findAll({
            attributes: ['macowNo', 'maLactation', 'maNumberOfServiceInCurrLact', 'maDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                const tranText = JSON.stringify(value);
                updateMating(Mating, tranText, res);
            }
            else {
                res.status(401).json({ error: true, message: "วันที่ผสมซ้ำกับข้อมูลที่มีในระบบ", check: 1 });
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving mating"
                });
            });
    }
};
async function updateMating(Mating, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveEdit_AI_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Mating.macowNo, param2: Mating.macomaMatingMethodwNo, param3: Mating.maDate
                , param4: Mating.maSemenId, param5: Mating.maSemenDose
                , param6: Mating.user_updated, param7: Mating.maTranId, param8: tranText
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

/*// Delete a mating with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    mating.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Mating was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete Mating with maTranId=${id}. Maybe Mating was not found!`,
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

// Delete all mating from the database.
exports.delete = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Mating = {
            macowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            maTranId: value.maTranId,
        };

        var condition = { maTranId: Mating.maTranId };

        await mating.findAll({
            attributes: ['macowNo', 'maLactation', 'maNumberOfServiceInCurrLact', 'maDate']
            , where: condition
        }).then(data => {
            if (data == '') {

                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการผสมเทียม", check: 0 });

            }
            else {

                const tranText = JSON.stringify(value);
                deleteMating(Mating, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving mating"
                });
            });
    }
};
async function deleteMating(Mating, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_AI_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Mating.maTranId, param2: Mating.user_updated, param3: tranText, param4: Mating.macowNo
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


// Find all published mating
exports.findAllPublished = (req, res) => {

};