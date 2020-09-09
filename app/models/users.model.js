module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("QUserStaff",
        {

        }, {
        tableName: 'QUserStaff'
    }
    );

    return users;
};