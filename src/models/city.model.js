const db = require('../db/initdb.js')

const tableName = 'city'
const tableColumns = {
    id: {
        type: 'integer',
        nullAuthorized: false,
        autoIncrement: true
    },
    name: {
        type: 'string',
        lenght: 100,
        nullAuthorized: false
    }
}

const reqSELECT = async (params) => {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqOrder = params.order ? ` ORDER BY ${params.order}` : ''
    let reqConditions = params.filter || ''
    const reqParams = []

    if (params.filter) {
        reqConditions = ` WHERE ${params.filter[0]} ${params.filter[1]} ?`
        reqParams.push(params.filter[2])
    }

    const reqSql = `SELECT ${reqColumns} FROM ${reqTables}${reqConditions}${reqOrder}`

    try {
        const rows = await db.conn.query(reqSql, reqParams)
        return {success: true, rows: rows}
    }
    catch(err) {
        return {success: false, code: 500, error: err, message: 'Une erreur est survenue !'}
    }
}

module.exports = { reqSELECT }