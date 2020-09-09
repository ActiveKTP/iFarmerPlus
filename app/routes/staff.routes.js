module.exports = app => {
    const staff = require("../controllers/staff.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new staff
    router.post("/", staff.create);

    // Retrieve all staff
    router.get("/", verify, staff.findAll);

    // Retrieve a single staff with id
    router.get("/:id", verify, staff.findOne);

    // Update a staff with id
    router.put("/:id", staff.update);

    // Delete a staff with id
    router.delete("/:id", staff.delete);

    // Create a new staff
    router.delete("/", staff.deleteAll);

    //

    app.use('/api/staff', router);
};