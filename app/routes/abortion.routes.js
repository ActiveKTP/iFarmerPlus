module.exports = app => {
    const abortion = require("../controllers/abortion.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Insert abortion
    router.post("/", verify, abortion.insert);

    // Retrieve all abortion
    router.get("/", verify, abortion.findAll);

    // Retrieve a single abortion with id
    router.get("/:id", verify, abortion.findOne);

    // Update a abortion with id
    router.put("/", verify, abortion.update);

    // Delete a abortion with id
    //router.delete("/:id", verify, abortion.delete);

    // Create a new abortion
    router.delete("/", verify, abortion.delete);

    //

    app.use('/api/abortion', router);
};