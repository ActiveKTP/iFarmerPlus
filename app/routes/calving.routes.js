module.exports = app => {
    const calving = require("../controllers/calving.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert calving
    router.post("/", verify, calving.insert);

    // Retrieve all calving
    router.get("/", verify, calving.findAll);

    // Retrieve a single calving with id
    router.get("/:id", verify, calving.findOne);

    // Update a calving with id
    router.put("/", verify, calving.update);

    // Delete a calving with id
    //router.delete("/:id", verify, calving.delete);

    // Create a new calving
    router.delete("/", verify, calving.delete);

    //

    app.use('/api/calving', router);
};