const db = require("../models");
const staff = db.staff.staff;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

// Create and Save a new staff
exports.create = (req, res) => {

};

// Retrieve all staff from the database.
exports.findAll = async (req, res) => {
    const orgCode = req.query.orgCode;
    //var condition = null;
    var condition = orgCode ? { staffOrgId: orgCode } : null;

    await staff.findAll({
        attributes: ['id', 'staffId', 'StaffFullName', 'staffOrgId', 'orgName', 'staffIdCard'
            , 'staffSex', 'staffBirthdate', 'staffAddress', 'staffTumbolCode'
            , 'staffAmphurCode', 'staffProvinceCode', 'staffZipCode', 'staffZoneCode'
            , 'staffEducation', 'staffAcademyMajor', 'staffGraduateYear', 'staffTelNo'
            , 'staffFaxNo', 'staffMobileNo', 'staffMarriageStatus', 'refMarriageStatusName'
            , 'refTumbolName', 'refAmphurName', 'refProvinceName', 'refEducateName', 'refMajorName'
        ]
        , where: condition
    })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: true,
                message:
                    err.message || "Some error occurred while retrieving staff."
            });
        });
};

// Find a single staff with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { staffId: id };
    /*staff.findByPk(id)
      .then(data => {
        res.json(data);
      })*/
    await staff.findAll({
        attributes: ['id', 'staffId', 'StaffFullName', 'staffOrgId', 'orgName', 'staffIdCard'
            , 'staffSex', 'staffBirthdate', 'staffAddress', 'staffTumbolCode'
            , 'staffAmphurCode', 'staffProvinceCode', 'staffZipCode', 'staffZoneCode'
            , 'staffEducation', 'staffAcademyMajor', 'staffGraduateYear', 'staffTelNo'
            , 'staffFaxNo', 'staffMobileNo', 'staffMarriageStatus', 'refMarriageStatusName'
            , 'refTumbolName', 'refAmphurName', 'refProvinceName', 'refEducateName', 'refMajorName'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving staff with id=" + id
            });
        });
};

// Update a staff by the id in the request
exports.update = (req, res) => {

};

// Delete a staff with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all staff from the database.
exports.deleteAll = (req, res) => {

};

// Find all published staff
exports.findAllPublished = (req, res) => {

};