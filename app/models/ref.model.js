module.exports = (sequelize, Sequelize) => {
    const pcCheckMethod = sequelize.define("RefPregChk",
        {

        }, {
        tableName: 'RefPregChk'
    }
    );

    const pcCheckResult = sequelize.define("RefPregResult",
        {

        }, {
        tableName: 'RefPregResult'
    }
    );

    const cvgParturition = sequelize.define("RefParturition",
        {

        }, {
        tableName: 'RefParturition'
    }
    );

    const cvgCalvingAsst = sequelize.define("RefCalvAsst",
        {

        }, {
        tableName: 'RefCalvAsst'
    }
    );

    const cvgCalvingResult = sequelize.define("RefCalvResult",
        {

        }, {
        tableName: 'RefCalvResult'
    }
    );

    const dryReason = sequelize.define("RefDryReason",
        {

        }, {
        tableName: 'RefDryReason'
    }
    );

    const abAbortionResult = sequelize.define("RefAbortResult",
        {

        }, {
        tableName: 'RefAbortResult'
    }
    );

    const RefSymtom = sequelize.define("RefSymtom",
        {

        }, {
        tableName: 'RefSymtom'
    }
    );

    const cullType = sequelize.define("RefCullStatus",
        {

        }, {
        tableName: 'RefCullStatus'
    }
    );

    const cullCause = sequelize.define("RefCullCause",
        {

        }, {
        tableName: 'RefCullCause'
    }
    );

    const eventCow = sequelize.define("RefEvent",
        {

        }, {
        tableName: 'RefEvent'
    }
    );

    return {
        pcCheckMethod: pcCheckMethod,
        pcCheckResult: pcCheckResult,
        cvgParturition: cvgParturition,
        cvgCalvingAsst: cvgCalvingAsst,
        cvgCalvingResult: cvgCalvingResult,
        dryReason: dryReason,
        abAbortionResult: abAbortionResult,
        RefSymtom: RefSymtom,
        cullType: cullType,
        cullCause: cullCause,
        eventCow: eventCow,
    };
};