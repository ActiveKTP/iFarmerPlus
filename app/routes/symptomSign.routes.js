module.exports = app => {
    const symSign = require("../controllers/symptomSign.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert symSign
    router.post("/", verify, symSign.insert);

    // Retrieve all symSign
    router.get("/", verify, symSign.findAll);

    // Retrieve a single symSign with id
    router.get("/:id", verify, symSign.findOne);

    // Update a symSign with id
    router.put("/", verify, symSign.update);

    // Delete a symSign with id
    //router.delete("/:id", verify, symSign.delete);

    // Create a new symSign
    router.delete("/", verify, symSign.delete);

    //

    app.use('/api/symptomSign', router);
};