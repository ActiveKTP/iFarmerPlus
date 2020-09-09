module.exports = (sequelize, Sequelize) => {
    const culling = sequelize.define("QCulling",
        {

        }, {
        tableName: 'QCulling'
    }
    );


    return {
        culling: culling,
    };
};