module.exports = (sequelize, Sequelize) => {
    const cowsFarm = sequelize.define("cowData_farmData",
        {

        }, {
        tableName: 'cowData_farmData'
    }
    );

    return cowsFarm;
};