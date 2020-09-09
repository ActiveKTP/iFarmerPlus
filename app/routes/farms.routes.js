module.exports = app => {
    const farms = require("../controllers/farms.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new farms
    router.post("/", farms.create);
    router.post("/search", farms.search);

    // Retrieve all farms
    router.get("/", verify, farms.findAll);

    // Retrieve a single farms with id
    router.get("/:id", verify, farms.findOne);

    // Update a farms with id
    router.put("/:id", farms.update);

    // Delete a farms with id
    router.delete("/:id", farms.delete);

    // Create a new farms
    router.delete("/", farms.deleteAll);

    //

    app.use('/api/farms', router);
};