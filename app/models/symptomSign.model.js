module.exports = (sequelize, Sequelize) => {
    const symSign = sequelize.define("QsymptomSign",
        {

        }, {
        tableName: 'QsymptomSign'
    }
    );

    const symSign_last = sequelize.define("QsymptomSign_last",
        {

        }, {
        tableName: 'QsymptomSign_last'
    }
    );

    return {
        symSign: symSign,
        symSign_last: symSign_last
    };
};