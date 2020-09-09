module.exports = (sequelize, Sequelize) => {
    const mating = sequelize.define("Mating",
        {

        }, {
        tableName: 'Mating'
    }
    );

    return mating;
};