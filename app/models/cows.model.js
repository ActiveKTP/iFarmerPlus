module.exports = (sequelize, Sequelize) => {
    const cows = sequelize.define("QcowData_DairyHub",
        {

        }, {
        tableName: 'QcowData_DairyHub'
    }
    );

    return cows;
};