const {runQuerySelectById} = require('./common/queries')

/*********************************************************
MODELE : DÉFINITION DE LA TABLE CITY
*********************************************************/

const dbTableDef = {
    tableName: 'city',
    tableColumns: {
        id: {
            type: 'integer',
            nullAuthorized: false,
            autoIncrement: true,
        },
        name: {
            type: 'string',
            lenght: 100,
            emptyAuthorized: false,
            nullAuthorized: false,
        },
        is_active: {
            type: 'boolean',
            nullAuthorized: false,
        }
    }
}

/*********************************************************
REQUÊTES SELECT
*********************************************************/

const querySelect = (params) => {
    return runQuerySelect(params, dbTableDef)
}

const querySelectById = (params) => {
    return runQuerySelectById(params, dbTableDef)
}

/*********************************************************
REQUÊTES DELETE
*********************************************************/

const queryDeleteById = (params) => {
    return runQueryDeleteById(params, dbTableDef)
}

module.exports = {querySelect, querySelectById, queryDeleteById}