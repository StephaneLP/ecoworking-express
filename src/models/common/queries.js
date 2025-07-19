const db = require('../../config/db')
const build = require('./build.js')
const {checkURIParam, checkQueryParams, checkOrderParams, checkBodyParams} = require('./validate.js')

/*********************************************************
SELECT
*********************************************************/

const runQuerySelect = async (params) => {
    let conn
    try {
        let check

        // Validation des Paramètres (clause WHERE)
        check = checkQueryParams(params)
        if (!check.success) return check

        // Validation du tri (clause ORDER)
        check = checkOrderParams(params)
        if (!check.success) return check

        // Construction de la requête SQL
        const sql = build.sqlSelect(params)

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

const runQuerySelectById = async (params) => {
    let conn
    try {
        // Validation du URI Parameter
        const check = checkURIParam(params)
        if (!check.success) return check
console.log(check)
        // Construction de la requête SQL
        const sql = build.sqlSelectById(params)
console.log(sql)
        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

/*********************************************************
INSERT INTO
*********************************************************/

const runQueryInsert = async (params) => {
    let conn
    try {
        // Validation des data (body)
        const check = checkBodyParams(params)
        if (!check.success) return check

        // Construction de la requête SQL
        const sql = build.sqlInsert(params)
        if (!sql.success) return sql

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        if (err.code) {
            return {success: false, functionName: 'queries.runQueryUpdateById', msg: `Code : ${err.code}, Message : Violation de la contrainte d'unicité - ${err.message}`}
        }
        throw new Error(err.message)
    }
    finally {
        if (conn) conn.end()
    }
}

/*********************************************************
UPDATE
*********************************************************/

const runQueryUpdateById = async (params) => {
    let conn, check
    try {
        // Validation du Path Parameter
        check = checkURIParam(params)
        if (!check.success) return check

        // Validation des data (body)
        check = checkBodyParams(params)
        if (!check.success) return check

        // Construction de la requête SQL
        const sql = build.sqlUpdateById(params)

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        if (err.code) {
            return {success: false, functionName: 'queries.runQueryUpdateById', msg: `Code : ${err.code}, Message : Violation de la contrainte d'unicité - ${err.message}`}
        }
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

/*********************************************************
DELETE
*********************************************************/

const runQueryDeleteById = async (params) => {
    let conn
    try {
        // Validation du Path Parameter
        const check = checkURIParam(params)
        if (!check.success) return check

        // Construction de la requête SQL
        const sql = build.sqlDeleteById(params)

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

/*********************************************************
FONCTIONS SPÉCIFIQUES
*********************************************************/

const runGetRecordByParams = async (params, tableDef) => {
    let conn
    try {
        // Construction de la requête SQL
        const sql = build.sqlSelect(params, tableDef)

        // Éxecution de la requête
        conn = await db.getConnection()
        return await conn.query(sql.reqString, sql.reqParams)
    }
    catch(err) {
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

module.exports = {runQuerySelect, runQuerySelectById, runQueryDeleteById, runQueryInsert, runQueryUpdateById, runGetRecordByParams}