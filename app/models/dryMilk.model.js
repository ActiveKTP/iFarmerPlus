module.exports = (sequelize, Sequelize) => {
    const dryMilk = sequelize.define("Lactation",
        {

        }, {
        tableName: 'Lactation'
    }
    );

    const dryMilkView = sequelize.define("QDryData_last_iService",
        {

        }, {
        tableName: 'QDryData_last_iService'
    }
    );

    return {
        dryMilk: dryMilk,
        dryMilkView: dryMilkView
    };
};