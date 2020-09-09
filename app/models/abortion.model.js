module.exports = (sequelize, Sequelize) => {
    const abortion = sequelize.define("Abortion",
        {

        }, {
        tableName: 'Abortion'
    }
    );

    const abortionView = sequelize.define("QAbortData_last_iService",
        {

        }, {
        tableName: 'QAbortData_last_iService'
    }
    );

    return {
        abortion: abortion,
        abortionView: abortionView
    };
};