module.exports = (sequelize, Sequelize) => {
    const calving = sequelize.define("Calving",
        {

        }, {
        tableName: 'Calving'
    }
    );

    const calvingView = sequelize.define("QCalvingData_last",
        {

        }, {
        tableName: 'QCalvingData_last'
    }
    );

    return {
        calving: calving,
        calvingView: calvingView
    };
};