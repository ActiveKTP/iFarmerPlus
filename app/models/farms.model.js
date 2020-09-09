module.exports = (sequelize, Sequelize) => {
    const farms = sequelize.define("farmQuery",
        {

        }, {
        tableName: 'searchFarmOwnerName'
    }
    );

    return farms;
};