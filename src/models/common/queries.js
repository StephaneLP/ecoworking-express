const db = require('../../config/db.js')
const build = require('./build.js')
const {checkURIParam, checkQueryParams, checkBodyParams} = require('./validate.js')

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
        // Validation des Paramètres
        const check = checkQueryParams(params.queryParams, dbTableDef.tableColumns)
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
        // Validation du URI Parameter
        const check = checkURIParam(params.URIParam, dbTableDef.tableColumns)
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
        const check = checkURIParam(params.URIParam, dbTableDef.tableColumns)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlDeleteById(params.URIParam, dbTableDef.tableName)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }     
}

/*********************************************************
INSERT INTO
*********************************************************/

const runQueryInsert = (dbTableDef, params) => {
    try {
        // Validation des data (body)
        const check = checkBodyParams(params.bodyParams, dbTableDef.tableColumns)
        if (!check.success) return check

         // Construction et éxecution de la requête SQL
         const sql = build.sqlInsert(params.bodyParams, dbTableDef)
        //   return runQuery(sql)
          return {success: true, result: sql}
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
}

module.exports = {runQuerySelect, runQuerySelectById, runQueryDeleteById, runQueryInsert}