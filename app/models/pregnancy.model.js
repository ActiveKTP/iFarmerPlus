module.exports = (sequelize, Sequelize) => {
    const pregnancyCheck = sequelize.define("PregnancyCheck",
        {

        }, {
        tableName: 'PregnancyCheck'
    }
    );

    const pregView = sequelize.define("QPregData_last_iService",
        {

        }, {
        tableName: 'QPregData_last_iService'
    }
    );

    return {
        pregnancyCheck: pregnancyCheck,
        pregView: pregView
    };
};