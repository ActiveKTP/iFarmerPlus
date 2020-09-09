module.exports = (sequelize, Sequelize) => {
    const cowAI_all = sequelize.define("aiData_cowPage_iservice",
        {

        }, {
        tableName: 'aiData_cowPage_iservice'
    }
    );

    const cowAI_currentLac = sequelize.define("aiData_cowPage_iFarmer",
        {

        }, {
        tableName: 'aiData_cowPage_iFarmer'
    }
    );

    const cowActivity = sequelize.define("QCowActivity",
        {

        }, {
        tableName: 'QCowActivity'
    }
    );

    return {
        cowAI_all: cowAI_all,
        cowAI_currentLac: cowAI_currentLac,
        cowActivity: cowActivity,
    }

};