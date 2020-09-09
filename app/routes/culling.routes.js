module.exports = app => {
    const culling = require("../controllers/culling.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert culling
    router.post("/", verify, culling.insert);

    // Retrieve all culling
    router.get("/", verify, culling.findAll);

    // Retrieve a single culling with id
    router.get("/:id", verify, culling.findOne);

    // Update a culling with id
    router.put("/", verify, culling.update);

    // Delete a culling with id
    //router.delete("/:id", verify, culling.delete);

    // Create a new culling
    router.delete("/", verify, culling.delete);

    //

    app.use('/api/culling', router);
};