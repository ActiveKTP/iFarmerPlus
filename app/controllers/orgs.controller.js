const db = require("../models");
const orgs = db.orgs;
const Op = db.Sequelize.Op;

// Create and Save a new orgs
exports.create = (req, res) => {

};

// Retrieve all orgs from the database.
exports.findAll = async (req, res) => {
    const title = req.query.title;
    //var condition = null;

    var condition = title ? { orgName: { [Op.like]: `%${title}%` } } : null;

    await orgs.findAll({
        attributes: ['orgCode'
            , 'orgType'
            , 'orgName'
            , 'orgAddress'
            , 'orgZoneCode'
            , 'orgProvinceCode'
            , 'orgAmphurCode'
            , 'orgTumbolCode'
            , 'orgZipCode'
            , 'orgTelNo'
            , 'orgFaxNo'
            , 'orgMobileNo'
            , 'orgPresidentName'
            , 'orgPresidentId'
            , 'orgWebsite'
            , 'orgEmailAddress'
            , 'orgRegisterDate'
            , 'refOrgTypeName'
            , 'refZoneName'
            , 'refProvinceName'
            , 'refAmphurName'
            , 'refTumbolName'
            , 'belongTo'
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
                    err.message || "Some error occurred while retrieving org."
            });
        });
};

// Find a single orgs with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = { orgCode: id };
    /*orgs.findByPk(id)
      .then(data => {
        res.send(data);
      })*/
    await orgs.findAll({
        attributes: ['orgCode'
            , 'orgType'
            , 'orgName'
            , 'orgAddress'
            , 'orgZoneCode'
            , 'orgProvinceCode'
            , 'orgAmphurCode'
            , 'orgTumbolCode'
            , 'orgZipCode'
            , 'orgTelNo'
            , 'orgFaxNo'
            , 'orgMobileNo'
            , 'orgPresidentName'
            , 'orgPresidentId'
            , 'orgWebsite'
            , 'orgEmailAddress'
            , 'orgRegisterDate'
            , 'refOrgTypeName'
            , 'refZoneName'
            , 'refProvinceName'
            , 'refAmphurName'
            , 'refTumbolName'
            , 'belongTo'
        ]
        , where: condition
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.status(500).json({
                error: true,
                message: "Error retrieving org with id=" + id
            });
        });
};

// Update a org by the id in the request
exports.update = (req, res) => {

};

// Delete a orgs with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all orgs from the database.
exports.deleteAll = (req, res) => {

};

// Find all published orgs
exports.findAllPublished = (req, res) => {

};