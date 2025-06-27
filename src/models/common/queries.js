const db = require('../../config/db.js')
const {checkPathParameter} = require('./validation')
const {buildSqlSelectById, buildSqlDeleteById} = require('./building')

/*********************************************************
SELECT
*********************************************************/

const selectQuery = async (sql) => {
    let conn
    try {
        conn = await db.getConnection()
        const rows = await conn.query(sql.reqString, sql.reqParams)
        return {success: true, rows: rows}
    } 
    catch (err) {
        throw new Error(`runQuery - ${err.name} (${err.message})`)
    } 
    finally {
        if (conn) conn.end()
    }    
}

const runSelectQueryById = (params, dbTableDef) => {
    try {
        // Validation du Path Parameter
        const check = checkPathParameter(params.pathParameter, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = buildSqlSelectById(params, dbTableDef.tableName)
        return selectQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}


/*********************************************************
DELETE
*********************************************************/

const runDeleteQuery = async (sql) => {
    let conn
    try {
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)
        return {success: true, result: result} 
    } 
    catch (err) {
        throw new Error(`runQuery - ${err.name} (${err.message})`)
    } 
    finally {
        if (conn) conn.end()
    }    
}

module.exports = {runSelectQueryById, runDeleteQuery}