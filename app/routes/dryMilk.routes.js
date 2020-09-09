module.exports = app => {
    const dryMilk = require("../controllers/dryMilk.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert dryMilk
    router.post("/", verify, dryMilk.insert);

    // Retrieve all dryMilk
    router.get("/", verify, dryMilk.findAll);

    // Retrieve a single dryMilk with id
    router.get("/:id", verify, dryMilk.findOne);

    // Update a dryMilk with id
    router.put("/", verify, dryMilk.update);

    // Delete a dryMilk with id
    //router.delete("/:id", verify, dryMilk.delete);

    // Create a new dryMilk
    router.delete("/", verify, dryMilk.delete);

    //

    app.use('/api/dryMilk', router);
};