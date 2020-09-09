module.exports = app => {
    const ref = require("../controllers/ref.controller.js");

    var router = require("express").Router();

    const verify = require('../verifyToken');

    // Create a new ref
    router.post("/", ref.create);
    router.post("/refSymptom/search", ref.search_refSymptom);

    // Retrieve all ref
    router.get("/", ref.findAll);

    // Retrieve a single ref with id
    router.get("/pcCheckMethod", verify, ref.findOne_pcCheckMethod);
    router.get("/pcCheckResult", verify, ref.findOne_pcCheckResult);
    router.get("/cvgParturition", verify, ref.findOne_cvgParturition);
    router.get("/cvgCalvingAsst", verify, ref.findOne_cvgCalvingAsst);
    router.get("/cvgCalvingResult", verify, ref.findOne_cvgCalvingResult);
    router.get("/dryReason", verify, ref.findOne_dryReason);
    router.get("/abAbortionResult", verify, ref.findOne_abAbortionResult);
    router.get("/refSymptom", verify, ref.findOne_refSymptom);
    router.get("/cullType", verify, ref.findAll_cullType);
    router.get("/cullCause", verify, ref.findAll_cullCause);
    router.get("/eventCow", verify, ref.findAll_eventCow);

    // Update a ref with id
    router.put("/:id", ref.update);

    // Delete a ref with id
    router.delete("/:id", ref.delete);

    // Create a new ref
    router.delete("/", ref.deleteAll);

    //

    app.use('/api/ref', router);
};