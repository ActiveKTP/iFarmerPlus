module.exports = app => {
    const orgs = require("../controllers/orgs.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new orgs
    router.post("/", orgs.create);

    // Retrieve all orgs
    router.get("/", verify, orgs.findAll);

    // Retrieve a single orgs with id
    router.get("/:id", verify, orgs.findOne);

    // Update a orgs with id
    router.put("/:id", orgs.update);

    // Delete a orgs with id
    router.delete("/:id", orgs.delete);

    // Create a new orgs
    router.delete("/", orgs.deleteAll);

    //

    app.use('/api/orgs', router);
};