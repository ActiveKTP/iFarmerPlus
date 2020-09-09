module.exports = (sequelize, Sequelize) => {
    const staff = sequelize.define("QStaffData",
        {

        }, {
        tableName: 'QStaffData'
    }
    );

    const staffFarm = sequelize.define("FarmStaffLastActivity180",
        {

        }, {
        tableName: 'FarmStaffLastActivity180'
    }
    );

    return {
        staff: staff,
        staffFarm: staffFarm
    };
};