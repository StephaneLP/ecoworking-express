const db = require('../db/initdb.js')

const tableName = 'city'
const model = {
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

const selectAll = async (params) => {
    const reqColumns = params.columns || '*'
    const reqFrom = params.join || tableName
    const reqOrder = params.order ? ` ORDER BY ${params.order}` : ''
    const reqSql = `SELECT ${reqColumns} FROM ${reqFrom} ${reqOrder}`

    try {
        const rows = await db.conn.query(reqSql)
        return {success: true, rows: rows}
    }
    catch(err) {
        return {success: false, err: err}
    }
}

module.exports = { model, selectAll }