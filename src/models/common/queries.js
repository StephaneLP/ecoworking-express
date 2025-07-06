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

const runQuerySelect = (params, tableDef) => {
    try {
        let check

        // Validation des Paramètres (clause WHERE)
        check = checkQueryParams(params, tableDef)
        if (!check.success) return check

        // Validation du tri (clause ORDER)
        // check = checkOrderParam(params, tableDef)
        // if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelect(params, tableDef)
        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}

const runQuerySelectById = (params, tableDef) => {
    try {
        // Validation du URI Parameter
        const check = checkURIParam(params, tableDef)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelectById(params, tableDef)

        return runQuery(sql)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }        
}

/*********************************************************
DELETE
*********************************************************/

const runQueryDeleteById = (params, tableDef) => {
    try {
        // Validation du Path Parameter
        const check = checkURIParam(params, tableDef)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlDeleteById(params, tableDef)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }     
}

/*********************************************************
INSERT INTO
*********************************************************/

const runQueryInsert = (params, tableDef) => {
    try {
        // Validation des data (body)
        const check = checkBodyParams(params.bodyParams, tableDef.tableColumns)
        if (!check.success) return check

         // Construction et éxecution de la requête SQL
         const sql = build.sqlInsert(params.bodyParams, tableDef)
         if (!sql.success) return sql
        //   return runQuery(sql)
          return {success: true, result: sql}
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
}

module.exports = {runQuerySelect, runQuerySelectById, runQueryDeleteById, runQueryInsert}