module.exports = app => {
    const semen = require("../controllers/semen.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new semen
    router.post("/", semen.create);
    router.post("/search", semen.search);

    // Retrieve all semen
    router.get("/", verify, semen.findAll);

    // Retrieve a single semen with id
    router.get("/:id", verify, semen.findOne);

    // Update a semen with id
    router.put("/:id", semen.update);

    // Delete a semen with id
    router.delete("/:id", semen.delete);

    // Create a new semen
    router.delete("/", semen.deleteAll);

    //

    app.use('/api/semen', router);
};