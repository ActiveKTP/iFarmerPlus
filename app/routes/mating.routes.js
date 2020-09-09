module.exports = app => {
    const mating = require("../controllers/mating.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert mating
    router.post("/", verify, mating.insert);

    // Retrieve all mating
    router.get("/", verify, mating.findAll);

    // Retrieve a single mating with id
    router.get("/:id", verify, mating.findOne);

    // Update a mating with id
    router.put("/", verify, mating.update);

    // Delete a mating with id
    //router.delete("/:id", verify, mating.delete);

    // Create a new mating
    router.delete("/", verify, mating.delete);

    //

    app.use('/api/mating', router);
};