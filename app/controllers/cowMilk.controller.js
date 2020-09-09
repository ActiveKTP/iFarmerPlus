const db = require("../models");
const cowMilkQuery = db.cowMilk.cowMilkQuery;
const cowMilk = db.cowMilk.cowMilk;
const cowsFarmMilk = db.cowsFarmMilk;
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
    collectDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    collectDate_month: Joi.number().integer().min(1).max(12),
    collectDate_day: Joi.number().integer().min(1).max(31),
    milk1: Joi.number().min(0).max(50),
    milk2: Joi.number().min(0).max(50),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    cvgTranId: Joi.number().integer(),
    milkTranId: Joi.number().integer(),
});

// Create and Save a new cowMilk
exports.create = (req, res) => {

};

// Insert a single cowMilk
exports.insert = async (req, res) => {
    if (!req.body.cvgTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const CowMilk = {
            ccowId: value.ccowId,
            ccowNo: value.ccowNo,
            collectDate: value.collectDate_month + '/' + value.collectDate_day + '/' + value.collectDate_year,
            milk1: value.milk1,
            milk2: value.milk2,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            cvgTranId: value.cvgTranId,
            milkTranId: null
        };

        var condition = {
            ccowNo: CowMilk.ccowNo, collectDate: CowMilk.collectDate
        };


        await cowMilk.findAll({
            attributes: ['ccowNo', 'collectDate']
            , where: condition
        }).then(data => {
            //console.log(data); return 0;
            if (data == '') {
                const tranText = JSON.stringify(value);
                insertCowMilk(CowMilk, tranText, res);
                //res.json(result[0]);

            }
            else {
                res.status(401).json({ error: true, message: "วันที่เก็บนมซ้ำกับข้อมูลที่มีในระบบ", check: 1 });
            }
        })
            .catch(err => {
                res.status(500).json({
                    message: "Error retrieving CowMilk"
                });
            });
    }

};
async function insertCowMilk(CowMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_MilkCow_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: CowMilk.cFarmId, param2: CowMilk.ccowId, param3: CowMilk.ccowNo, param4: CowMilk.collectDate
                , param5: CowMilk.milk1, param6: CowMilk.milk2, param7: CowMilk.cvgTranId, param8: CowMilk.milkTranId
                , param9: CowMilk.user_updated, param10: tranText
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

// Retrieve all CowMilk from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
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
                        err.message || "Some error occurred while retrieving CowMilk."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single CowMilk with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { milkTranId: id };
    /*CowMilk.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
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
            , 'mkDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving CowMilk with milkTranId=" + id
            });
        });
};

exports.findOne_milkTranId = async (req, res) => {
    const ccowNo = req.query.ccowNo;
    const collectDate = req.query.collectDate;
    var condition = { ccowNo: ccowNo, collectDate: collectDate };
    /*CowMilk.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await cowMilk.findAll({
        attributes: [
            'cvgTranId'
            , 'milkTranId'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving CowMilk with ccowNo=" + ccowNo + " and collectDate=" + collectDate
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.milkTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const CowMilk = {
            ccowId: value.ccowId,
            ccowNo: value.ccowNo,
            collectDate: value.collectDate_month + '/' + value.collectDate_day + '/' + value.collectDate_year,
            milk1: value.milk1,
            milk2: value.milk2,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            cvgTranId: value.cvgTranId,
            milkTranId: value.milkTranId
        };

        var condition = {
            ccowNo: CowMilk.ccowNo, collectDate: CowMilk.collectDate
            , milkTranId: { [Op.ne]: CowMilk.milkTranId }
        };

        await cowMilk.findAll({
            attributes: ['ccowNo', 'milkTranId', 'collectDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                const tranText = JSON.stringify(value);
                updateCowMilk(CowMilk, tranText, res);
            }
            else {
                res.status(401).json({ error: true, message: "วันที่เก็บนมซ้ำกับข้อมูลที่มีในระบบ", check: 1 });
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving CowMilk"
                });
            });
    }
};
async function updateCowMilk(CowMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_MilkCow_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: CowMilk.cFarmId, param2: CowMilk.ccowId, param3: CowMilk.ccowNo, param4: CowMilk.collectDate
                , param5: CowMilk.milk1, param6: CowMilk.milk2, param7: CowMilk.cvgTranId, param8: CowMilk.milkTranId
                , param9: CowMilk.user_updated, param10: tranText
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

/*// Delete a CowMilk with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    CowMilk.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "CowMilk was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete CowMilk with maTranId=${id}. Maybe CowMilk was not found!`,
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

// Delete all CowMilk from the database.
exports.delete = async (req, res) => {
    if (!req.body.milkTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const CowMilk = {
            ccowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            milkTranId: value.milkTranId,
        };

        var condition = { milkTranId: CowMilk.milkTranId };

        await cowMilk.findAll({
            attributes: ['ccowNo', 'milkTranId', 'collectDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการเก็บนม", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                deleteCowMilk(CowMilk, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving CowMilk"
                });
            });
    }
};
async function deleteCowMilk(CowMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_MilkCow_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: CowMilk.milkTranId, param2: CowMilk.user_updated, param3: tranText, param4: CowMilk.ccowNo
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


// Find all published CowMilk
exports.findAllPublished = (req, res) => {

};