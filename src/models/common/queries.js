const db = require('../../config/db.js')
const build = require('./build.js')
const {checkURIParam, checkQueryString} = require('./validate.js')

/*********************************************************
ÉXECUTION DE LA REQUÊTE
*********************************************************/

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

const runQuerySelect = (dbTableDef, params) => {
    try {
        // Validation du Path Parameter
        const check = checkQueryString(params.queryStringParams, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelect(params, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}

const runQuerySelectById = (dbTableDef, params) => {
    try {
        // Validation du Path Parameter
        const check = checkURIParam(params.pathParam, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelectById(params, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}

/*********************************************************
DELETE
*********************************************************/

const runQueryDeleteById = (dbTableDef, params) => {
    try {
        // Validation du Path Parameter
        const check = checkURIParam(params.pathParam, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlDeleteById(params, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }     
}

module.exports = {runQuerySelect, runQuerySelectById, runQueryDeleteById}