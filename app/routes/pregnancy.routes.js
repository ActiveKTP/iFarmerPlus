module.exports = app => {
    const pregnancy = require("../controllers/pregnancy.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert pregnancy
    router.post("/", verify, pregnancy.insert);

    // Retrieve all pregnancy
    router.get("/", verify, pregnancy.findAll);

    // Retrieve a single pregnancy with id
    router.get("/:id", verify, pregnancy.findOne);

    // Update a pregnancy with id
    router.put("/", verify, pregnancy.update);

    // Delete a pregnancy with id
    //router.delete("/:id", verify, pregnancy.delete);

    // Create a new pregnancy
    router.delete("/", verify, pregnancy.delete);

    //

    app.use('/api/pregnancyCheck', router);
};