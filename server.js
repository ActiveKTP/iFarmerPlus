const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:4002"
};

app.use(cors(corsOptions));

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//Create table////////////
//const db = require("./app/models");
//db.sequelize.sync();
//drop table if it already exists
//db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and re-sync db.");
//});
//////////////////////////

//Middleware

/////////////////////////////////////

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to iFarmerPlus WebAPI." });
});

/*app.post("/", (req, res) => {
    res.json({ message: req.body });
});*/

require("./app/routes/semen.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/staff.routes")(app);
require("./app/routes/orgs.routes")(app);
require("./app/routes/farms.routes")(app);
require("./app/routes/cows.routes")(app);
require("./app/routes/mating.routes")(app);
require("./app/routes/pregnancy.routes")(app);
require("./app/routes/abortion.routes")(app);
require("./app/routes/calving.routes")(app);
require("./app/routes/dryMilk.routes")(app);
require("./app/routes/cowMilk.routes")(app);
require("./app/routes/symptomSign.routes")(app);
require("./app/routes/culling.routes")(app);
require("./app/routes/ref.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});