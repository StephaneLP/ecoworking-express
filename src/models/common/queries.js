const db = require('../../config/db.js')
const {checkPathParameter} = require('./validation')
const {buildSqlSelectById, buildSqlDeleteById} = require('./building')

const runQuery = async (sql) => {
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

/*********************************************************
SELECT
*********************************************************/

const runQuerySelectById = (params, dbTableDef) => {
    try {
        // Validation du Path Parameter
        const check = checkPathParameter(params.pathParameter, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = buildSqlSelectById(params, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}

/*********************************************************
DELETE
*********************************************************/

const runQueryDeleteById = (params, dbTableDef) => {
    try {
        // Validation du Path Parameter
        const check = checkPathParameter(params.pathParameter, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = buildSqlDeleteById(params, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }     
}

module.exports = {runQuerySelectById, runQueryDeleteById}