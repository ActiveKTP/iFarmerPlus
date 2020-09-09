const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});


const db = {};

db.Sequelize = Sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);

db.semens = require("./semen.model.js")(sequelize, Sequelize);
db.staff = require("./staff.model.js")(sequelize, Sequelize);
db.orgs = require("./orgs.model.js")(sequelize, Sequelize);

db.farms = require("./farms.model.js")(sequelize, Sequelize);
db.cows = require("./cows.model.js")(sequelize, Sequelize);
db.cowAI = require("./cowAI.model.js")(sequelize, Sequelize);
db.cowLactation = require("./cowLactation.model.js")(sequelize, Sequelize);
db.cowMilk = require("./cowMilk.model.js")(sequelize, Sequelize);
db.cowsFarm = require("./cowsFarm.model.js")(sequelize, Sequelize);
db.cowsFarmMilk = require("./cowsFarmMilk.model.js")(sequelize, Sequelize);
db.cowsFarmEvent = require("./cowsFarmEvent.model.js")(sequelize, Sequelize);
db.mating = require("./mating.model.js")(sequelize, Sequelize);
db.pregnancyCheck = require("./pregnancy.model.js")(sequelize, Sequelize);
db.abortion = require("./abortion.model.js")(sequelize, Sequelize);
db.calving = require("./calving.model.js")(sequelize, Sequelize);
db.dryMilk = require("./dryMilk.model.js")(sequelize, Sequelize);
db.symSign = require("./symptomSign.model.js")(sequelize, Sequelize);
db.culling = require("./culling.model.js")(sequelize, Sequelize);
db.ref = require("./ref.model.js")(sequelize, Sequelize);

module.exports = db;