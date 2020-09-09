const db = require("../models");
const calving = db.calving.calving;
const calvingView = db.calving.calvingView;
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
    cvgDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    cvgDate_month: Joi.number().integer().min(1).max(12),
    cvgDate_day: Joi.number().integer().min(1).max(31),
    firstChild: Joi.string().min(1).max(1),
    secondChild: Joi.string().min(1).max(1),
    cvgParturition: Joi.string().alphanum().min(2).max(2),
    cvgCalvingResult: Joi.string().alphanum().min(1).max(1),
    cvgCalvingAsst: Joi.string().alphanum().min(2).max(2),
    cFarmId: Joi.string().alphanum().min(3).max(10),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    maTranId: Joi.number().integer(),
});

// Create and Save a new calving
exports.create = (req, res) => {

};

// Insert a single calving
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Calving = {
            ccowId: value.ccowId,
            cvgCowNo: value.ccowNo,
            cvgDate: value.cvgDate_month + '/' + value.cvgDate_day + '/' + value.cvgDate_year,
            firstChild: value.firstChild,
            secondChild: value.secondChild,
            cvgParturition: value.cvgParturition,
            cvgCalvingResult: value.cvgCalvingResult,
            cvgCalvingAsst: value.cvgCalvingAsst,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            cvgMaTranId: value.maTranId
        };

        var condition = {
            macowNo: Calving.cvgCowNo, maTranId: Calving.cvgMaTranId
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
                insertCalving(Calving, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Calving"
                });
            });
    }

};
async function insertCalving(Calving, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_CV_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10, :param11, :param12 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Calving.ccowId, param2: Calving.cvgCowNo, param3: Calving.cvgDate, param4: Calving.firstChild
                , param5: Calving.secondChild, param6: Calving.cvgParturition, param7: Calving.cvgCalvingResult, param8: Calving.cvgCalvingAsst
                , param9: Calving.cFarmId, param10: Calving.user_updated, param11: tranText, param12: Calving.cvgMaTranId
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

// Retrieve all Calving from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    console.log(condition);
    if (condition) {
        await calvingView.findAll({
            attributes: ['maLactation'
                , 'maNumberOfServiceInCurrLact'
                , 'maDate'
                , 'maSemenId'
                , 'maTranId'
                , 'cvgDate'
                , 'cvgTranId'
                , 'firstChild'
                , 'secondChild'
                , 'cvgStaffId'
                , 'cFarmId'
                , 'cvgParturition'
                , 'cvgCalvingAsst'
                , 'cvgCalvingResult'
                , 'maPregResult'
                , 'ccowNo'
                , 'ccowId'
                , 'cStatus'
                , 'cProductionStatus'
                , 'cMilkingStatus'
                , 'cvgDateUpdate'
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
                        err.message || "Some error occurred while retrieving Calving."
                });
            });
    } else {
        res.status(401).json({
            error: true,
            message: "Condition false."
        });
    }
};

// Find a single Calving with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { maTranId: id };
    /*Calving.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await calvingView.findAll({
        attributes: ['maLactation'
            , 'maNumberOfServiceInCurrLact'
            , 'maDate'
            , 'maSemenId'
            , 'maTranId'
            , 'cvgDate'
            , 'cvgTranId'
            , 'firstChild'
            , 'secondChild'
            , 'cvgStaffId'
            , 'cFarmId'
            , 'cvgParturition'
            , 'cvgCalvingAsst'
            , 'cvgCalvingResult'
            , 'maPregResult'
            , 'ccowNo'
            , 'ccowId'
            , 'cStatus'
            , 'cProductionStatus'
            , 'cMilkingStatus'
            , 'cvgDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving Calving with maTranId=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Calving = {
            ccowId: value.ccowId,
            cvgCowNo: value.ccowNo,
            cvgDate: value.cvgDate_month + '/' + value.cvgDate_day + '/' + value.cvgDate_year,
            firstChild: value.firstChild,
            secondChild: value.secondChild,
            cvgParturition: value.cvgParturition,
            cvgCalvingResult: value.cvgCalvingResult,
            cvgCalvingAsst: value.cvgCalvingAsst,
            cFarmId: value.cFarmId,
            //pcStaffId: value.pcStaffId,
            user_updated: value.USER_NAME,
            cvgMaTranId: value.maTranId
        };

        var condition = { cvgMaTranId: Calving.cvgMaTranId };

        await calving.findAll({
            attributes: ['cvgCowNo', 'cvgMaTranId', 'cvgDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการคลอด", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updateCalving(Calving, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Calving"
                });
            });
    }
};
async function updateCalving(Calving, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_CV_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10, :param11, :param12 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Calving.ccowId, param2: Calving.cvgCowNo, param3: Calving.cvgDate, param4: Calving.firstChild
                , param5: Calving.secondChild, param6: Calving.cvgParturition, param7: Calving.cvgCalvingResult, param8: Calving.cvgCalvingAsst
                , param9: Calving.cFarmId, param10: Calving.user_updated, param11: tranText, param12: Calving.cvgMaTranId
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

/*// Delete a Calving with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Calving.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Calving was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete Calving with maTranId=${id}. Maybe Calving was not found!`,
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

// Delete all Calving from the database.
exports.delete = async (req, res) => {
    if (!req.body.maTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Calving = {
            cvgCowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            cvgMaTranId: value.maTranId,
        };

        var condition = { cvgMaTranId: Calving.cvgMaTranId };

        await calving.findAll({
            attributes: ['cvgCowNo', 'cvgMaTranId', 'cvgDate']
            , where: condition
        }).then(data => {
            if (data == '') {

                res.status(401).json({ error: true, message: "ไม่พบข้อมูลการคลอด", check: 0 });

            }
            else {

                const tranText = JSON.stringify(value);
                deleteCalving(Calving, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Calving"
                });
            });
    }
};
async function deleteCalving(Calving, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_CV_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Calving.cvgMaTranId, param2: Calving.user_updated, param3: tranText, param4: Calving.cvgCowNo
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


// Find all published Calving
exports.findAllPublished = (req, res) => {

};