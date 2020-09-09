module.exports = (sequelize, Sequelize) => {
    const cowMilkQuery = sequelize.define("QCowMilk_iFarmer",
        {

        }, {
        tableName: 'QCowMilk_iFarmer'
    }
    );

    const cowMilk = sequelize.define("CowMilk_iFarmer",
        {

        }, {
        tableName: 'CowMilk_iFarmer'
    }
    );

    return {
        cowMilkQuery: cowMilkQuery,
        cowMilk: cowMilk,
    };
};