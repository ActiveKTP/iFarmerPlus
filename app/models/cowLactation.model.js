module.exports = (sequelize, Sequelize) => {
    const cowLactation = sequelize.define("Cow_Lactation",
        {

        }, {
        tableName: 'Cow_Lactation'
    }
    );

    return cowLactation;
};