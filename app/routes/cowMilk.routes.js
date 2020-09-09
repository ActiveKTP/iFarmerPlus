module.exports = app => {
    const cowMilk = require("../controllers/cowMilk.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert cowMilk
    router.post("/", verify, cowMilk.insert);

    // Retrieve all cowMilk
    router.get("/", verify, cowMilk.findAll);
    router.get("/milkTranId", verify, cowMilk.findOne_milkTranId);

    // Retrieve a single cowMilk with id
    router.get("/:id", verify, cowMilk.findOne);

    // Update a cowMilk with id
    router.put("/", verify, cowMilk.update);

    // Delete a cowMilk with id
    //router.delete("/:id", verify, cowMilk.delete);

    // Create a new cowMilk
    router.delete("/", verify, cowMilk.delete);

    //

    app.use('/api/cowMilk', router);
};