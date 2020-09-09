module.exports = app => {
    const cows = require("../controllers/cows.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new cows
    router.post("/", cows.create);
    router.post("/search", cows.search);
    router.post("/search/milkdata", cows.search_milkdata);

    // Retrieve all cows
    router.get("/ai", verify, cows.findAll);
    router.get("/milk", verify, cows.findAll_milk);

    // Retrieve a single cows with id
    router.get("/:id", verify, cows.findOne);

    // Retrieve a single cows with id
    router.get("/ai/:id", verify, cows.findOne_ai);
    router.get("/lactation/:id", verify, cows.findOne_lactation);
    router.get("/milk/:id", verify, cows.findOne_milk);
    router.get("/symptom/:id", verify, cows.findOne_symptom);
    //


    // Update a cows with id
    router.put("/:id", cows.update);

    // Delete a cows with id
    router.delete("/:id", cows.delete);

    // Create a new cows
    router.delete("/", cows.deleteAll);

    //

    app.use('/api/cows', router);
};