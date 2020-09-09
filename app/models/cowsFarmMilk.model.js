module.exports = (sequelize, Sequelize) => {
    const cowsFarmMilk = sequelize.define("CowData_farmData_MK",
        {

        }, {
        tableName: 'CowData_farmData_MK'
    }
    );

    return cowsFarmMilk;
};