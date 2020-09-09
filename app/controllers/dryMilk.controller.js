const db = require("../models");
const dryMilk = db.dryMilk.dryMilk;
const dryMilkView = db.dryMilk.dryMilkView;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');
//console.log(new Date().getFullYear());
//console.log(new Date().getMonth() + 1);
//console.log(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());

const schema = Joi.object({
    ccowId: Joi.string().alphanum().min(4).max(15),
    ccowNo: Joi.number().integer(),
    dryDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    dryDate_month: Joi.number().integer().min(1).max(12),
    dryDate_day: Joi.number().integer().min(1).max(31),
    dryReasonId: Joi.string().alphanum().min(2).max(2),
    lacDayInMilk: Joi.number().integer().min(1),
    dryMilkYieldOnDryDate: Joi.number().min(0).max(50),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    lacTranId: Joi.number().integer(),
});

// Create and Save a new dryMilk
exports.create = (req, res) => {

};

// Insert a single dryMilk
exports.insert = async (req, res) => {
    if (!req.body.lacTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const DryMilk = {
            ccowId: value.ccowId,
            lacCowNo: value.ccowNo,
            dryDate: value.dryDate_month + '/' + value.dryDate_day + '/' + value.dryDate_year,
            dryReasonId: value.dryReasonId,
            lacDayInMilk: value.lacDayInMilk,
            dryMilkYieldOnDryDate: value.dryMilkYieldOnDryDate,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            lacTranId: value.lacTranId
        };

        var condition = {
            lacCowNo: DryMilk.lacCowNo, lacTranId: DryMilk.lacTranId
        };

        await dryMilk.findAll({
            attributes: ['lacCowNo', 'lacNo', 'lacDateCommencingLac']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการคลอด", check: 0 });
            }
            else {
                const tranText = JSON.stringify(value);
                insertDryMilk(DryMilk, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving DryMilk"
                });
            });
    }

};
async function insertDryMilk(DryMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_DR_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: DryMilk.lacCowNo, param2: DryMilk.lacTranId, param3: DryMilk.dryDate, param4: DryMilk.dryReasonId
                , param5: DryMilk.user_updated, param6: tranText, param7: DryMilk.ccowId, param8: DryMilk.lacDayInMilk, param9: DryMilk.dryMilkYieldOnDryDate
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

// Retrieve all DryMilk from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
        await dryMilkView.findAll({
            attributes: ['ccowId'
                , 'lacNo'
                , 'lacDateCommencingLac'
                , 'dryDate'
                , 'dryStaffId'
                , 'lacTranId'
                , 'cStatus'
                , 'cProductionStatus'
                , 'cMilkingStatus'
                , 'ccowNo'
                , 'dryReasonId'
                , 'dryMilkYieldOnDryDate'
                , 'drDateUpdate'
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
                        err.message || "Some error occurred while retrieving DryMilk."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single DryMilk with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { lacTranId: id };
    /*DryMilk.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await dryMilkView.findAll({
        attributes: ['ccowId'
            , 'lacNo'
            , 'lacDateCommencingLac'
            , 'dryDate'
            , 'dryStaffId'
            , 'lacTranId'
            , 'cStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'ccowNo'
            , 'dryReasonId'
            , 'dryMilkYieldOnDryDate'
            , 'drDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving DryMilk with lacTranId=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.lacTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const DryMilk = {
            ccowId: value.ccowId,
            lacCowNo: value.ccowNo,
            dryDate: value.dryDate_month + '/' + value.dryDate_day + '/' + value.dryDate_year,
            dryReasonId: value.dryReasonId,
            lacDayInMilk: value.lacDayInMilk,
            dryMilkYieldOnDryDate: value.dryMilkYieldOnDryDate,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            lacTranId: value.lacTranId
        };

        var condition = { lacCowNo: DryMilk.lacCowNo, lacTranId: DryMilk.lacTranId };

        await dryMilk.findAll({
            attributes: ['lacCowNo', 'lacNo', 'lacDateCommencingLac']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการคลอด", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updateDryMilk(DryMilk, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving DryMilk"
                });
            });
    }
};
async function updateDryMilk(DryMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_DR_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: DryMilk.lacCowNo, param2: DryMilk.lacTranId, param3: DryMilk.dryDate, param4: DryMilk.dryReasonId
                , param5: DryMilk.user_updated, param6: tranText, param7: DryMilk.ccowId, param8: DryMilk.lacDayInMilk, param9: DryMilk.dryMilkYieldOnDryDate
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

/*// Delete a DryMilk with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    DryMilk.destroy({
        where: { lacTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "DryMilk was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete DryMilk with lacTranId=${id}. Maybe DryMilk was not found!`,
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

// Delete all DryMilk from the database.
exports.delete = async (req, res) => {
    if (!req.body.lacTranId) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const DryMilk = {
            lacCowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            lacTranId: value.lacTranId,
        };

        var condition = { lacTranId: DryMilk.lacTranId };

        await dryMilk.findAll({
            attributes: ['lacCowNo', 'lacNo', 'lacDateCommencingLac']
            , where: condition
        }).then(data => {
            if (data == '') {

                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการคลอด", check: 0 });

            }
            else {

                const tranText = JSON.stringify(value);
                deleteDryMilk(DryMilk, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving DryMilk"
                });
            });
    }
};
async function deleteDryMilk(DryMilk, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_DR_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: DryMilk.lacTranId, param2: DryMilk.user_updated, param3: tranText, param4: DryMilk.lacCowNo
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


// Find all published DryMilk
exports.findAllPublished = (req, res) => {

};