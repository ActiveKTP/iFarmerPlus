module.exports = (sequelize, Sequelize) => {
    const org = sequelize.define("QOrg_semen",
        {

        }, {
        tableName: 'QOrg_semen'
    }
    );

    return org;
};