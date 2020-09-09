module.exports = (sequelize, Sequelize) => {
    const cowsFarmEvent = sequelize.define("QEvent",
        {

        }, {
        tableName: 'QEvent'
    }
    );

    return cowsFarmEvent;
};