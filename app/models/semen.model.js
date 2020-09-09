module.exports = (sequelize, Sequelize) => {
    const semen = sequelize.define("QSemenData_AnimalType",
        {

        }, {
        tableName: 'QSemenData_AnimalType'
    }
    );

    return semen;
};