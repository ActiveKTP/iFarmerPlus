const db = require("../models");
const culling = db.culling.culling;
const cows = db.cows;
const Op = db.Sequelize.Op;

//VALIDATION
const Joi = require('@hapi/joi');
//console.log(new Date().getFullYear());
//console.log(new Date().getMonth() + 1);
//console.log(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());

const schema = Joi.object({
    ccowId: Joi.string().alphanum().min(4).max(15),
    ccowNo: Joi.number().integer(),
    cullDate_year: Joi.number().integer().min(2000).max(new Date().getFullYear()),
    cullDate_month: Joi.number().integer().min(1).max(12),
    cullDate_day: Joi.number().integer().min(1).max(31),
    cullType: Joi.string().min(2).max(2),
    cullCause: Joi.string().alphanum().min(3).max(3),
    //pcStaffId: Joi.string().alphanum().min(3).max(15),
    cullFrom: Joi.string().alphanum().min(3).max(10).allow(null),
    cullTo: Joi.string().alphanum().min(3).max(10).allow(null),
    USER_NAME: Joi.string().alphanum().min(3).max(13),
    cullTranId: Joi.number().integer(),
});

// Create and Save a new culling
exports.create = (req, res) => {

};

// Insert a single culling
exports.insert = async (req, res) => {
    if (!req.body.ccowNo) res.status(400).json({ error: true, message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Culling = {
            ccowId: value.ccowId,
            cullCowNo: value.ccowNo,
            cullDate: value.cullDate_month + '/' + value.cullDate_day + '/' + value.cullDate_year,
            cullType: value.cullType,
            cullCause: value.cullCause,
            //pcStaffId: value.pcStaffId,
            cullFrom: value.cullFrom,
            cullTo: value.cullTo,
            user_updated: value.USER_NAME,
            cullTranId: value.cullTranId
        };

        var condition = {
            ccowNo: Culling.cullCowNo
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
                insertCulling(Culling, tranText, res);
                //res.json(result[0]);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Culling"
                });
            });
    }

};
async function insertCulling(Culling, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveAdd_culling_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Culling.ccowId, param2: Culling.cullCowNo, param3: Culling.cullFrom, param4: Culling.cullTo
                , param5: Culling.cullType, param6: Culling.cullCause, param7: Culling.cullDate, param8: Culling.user_updated, param9: tranText
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

// Retrieve all Culling from the database.
exports.findAll = async (req, res) => {
    const cowId = req.query.cowId;
    const limit = req.query.limit;
    //var condition = null;

    var condition = cowId ? { ccowId: cowId } : null;
    var limitEndNum = limit ? parseInt(limit) : null;
    console.log(limitEndNum);
    if (condition) {
        await culling.findAll({
            limit: limitEndNum
            , attributes: ['ccowNo'
                , 'ccowId'
                , 'ccowName'
                , 'cBirthDate'
                , 'cullDate'
                , 'cullType'
                , 'refCullStatusName'
                , 'cullCause'
                , 'refCullName'
                , 'cullFrom'
                , 'cullTo'
                , 'cullStaffId'
                , 'cullTranId'
                , 'cullDateUpdate'
            ]
            , where: condition
            , order: [['cullDate', 'DESC']]
        })
            .then(data => {
                //console.log(res.user);
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message:
                        err.message || "Some error occurred while retrieving Culling."
                });
            });
    } else {
        res.status(401).json({
            message: "Can not access data."
        });
    }
};

// Find a single Culling with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { cullTranId: id };
    /*Culling.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await culling.findAll({
        attributes: ['ccowNo'
            , 'ccowId'
            , 'ccowName'
            , 'cBirthDate'
            , 'cullDate'
            , 'cullType'
            , 'refCullStatusName'
            , 'cullCause'
            , 'refCullName'
            , 'cullFrom'
            , 'cullTo'
            , 'cullStaffId'
            , 'cullTranId'
            , 'cullDateUpdate'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving Culling with cullTranId=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = async (req, res) => {
    if (!req.body.cullTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Culling = {
            ccowId: value.ccowId,
            cullCowNo: value.ccowNo,
            cullDate: value.cullDate_month + '/' + value.cullDate_day + '/' + value.cullDate_year,
            cullType: value.cullType,
            cullCause: value.cullCause,
            //pcStaffId: value.pcStaffId,
            cullFrom: value.cullFrom,
            cullTo: value.cullTo,
            user_updated: value.USER_NAME,
            cullTranId: value.cullTranId
        };

        var condition = {
            cullTranId: Culling.cullTranId
        };

        await culling.findAll({
            attributes: ['ccowNo', 'cullDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลคัดจำหน่ายโค", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                updateCulling(Culling, tranText, res);
            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Culling"
                });
            });
    }
};
async function updateCulling(Culling, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = saveEdit_culling_iFarmerPlus :param1, :param2, :param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Culling.ccowId, param2: Culling.cullCowNo, param3: Culling.cullFrom, param4: Culling.cullTo
                , param5: Culling.cullType, param6: Culling.cullCause, param7: Culling.cullDate, param8: Culling.user_updated, param9: tranText
                , param10: Culling.cullTranId
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

/*// Delete a Culling with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Culling.destroy({
        where: { maTranId: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Culling was deleted successfully!",
                    check: 1
                });
            } else {
                res.json({
                    message: `Cannot delete Culling with maTranId=${id}. Maybe Culling was not found!`,
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

// Delete all Culling from the database.
exports.delete = async (req, res) => {
    if (!req.body.cullTranId) res.status(400).json({ message: "Not found body object" });
    //LET VALIDATE THE DATA BEFORE USE
    //const validation = Joi.valid(req.body, schema);
    //res.json(validation);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    else {
        //return res.status(200).json(value)

        const Culling = {
            cullCowNo: value.ccowNo,
            user_updated: value.USER_NAME,
            cullTranId: value.cullTranId,
        };

        var condition = {
            cullTranId: Culling.cullTranId
        };

        await culling.findAll({
            attributes: ['ccowNo', 'cullDate']
            , where: condition
        }).then(data => {
            if (data == '') {
                res.status(401).json({ error: true, message: "ไม่พบข้อมูลคัดจำหน่ายโค", check: 0 });
            }
            else {

                const tranText = JSON.stringify(value);
                deleteCulling(Culling, tranText, res);
                //res.json(data);

            }
        })
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: "Error retrieving Culling"
                });
            });
    }
};
async function deleteCulling(Culling, tranText, res) {
    //console.log(tranText);
    await db.sequelize.query('DECLARE @RESULT AS INTEGER; EXEC @RESULT = delete_culling_iFarmerPlus :param1, :param2, :param3, :param4 ;  SELECT @RESULT AS result ;',
        {
            replacements: {
                param1: Culling.cullTranId, param2: Culling.user_updated, param3: tranText, param4: Culling.cullCowNo
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


// Find all published Culling
exports.findAllPublished = (req, res) => {

};