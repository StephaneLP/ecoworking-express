const {checkPathParameter} = require('./common/validation')
const {buildSqlSelectById, buildSqlDeleteById} = require('./common/building')
const {runSelectQueryById, runDeleteQuery} = require('./common/queries')

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
SELECT
*********************************************************/

const runSelect = (params) => {
    return reqSELECT(params, dbTableDef)
}

const runSelectById = (params) => {
    return runSelectQueryById(params, dbTableDef)
}

/*********************************************************
DELETE
*********************************************************/

const runDeleteById = (params) => {
    try {
        // Validation du Path Parameter
        const check = checkPathParameter(params.pathParameter, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = buildSqlDeleteById(params, dbTableDef.tableName)
        return runDeleteQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
}

module.exports = {runSelect, runSelectById, runDeleteById}