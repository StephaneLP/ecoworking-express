const db = require('../../config/db')
const build = require('./build.js')
const {checkURIParam, checkQueryParams, checkOrderParam, checkBodyParams} = require('./validate.js')

/*********************************************************
SELECT
*********************************************************/

const runQuerySelect = async (params, tableDef) => {
    let conn
    try {
        let check

        // Validation des Paramètres (clause WHERE)
        check = checkQueryParams(params, tableDef)
        if (!check.success) return check

        // Validation du tri (clause ORDER)
        check = checkOrderParam(params, tableDef)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelect(params, tableDef)

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

const runQuerySelectById = async (params, tableDef) => {
    let conn
    try {
        // Validation du URI Parameter
        const check = checkURIParam(params, tableDef)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlSelectById(params, tableDef)

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
DELETE
*********************************************************/

const runQueryDeleteById = async (params, tableDef) => {
    let conn
    try {
        // Validation du Path Parameter
        const check = checkURIParam(params, tableDef)
        if (!check.success) return check

        // Construction et éxecution de la requête SQL
        const sql = build.sqlDeleteById(params, tableDef)

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

const runQueryInsert = async (params, tableDef) => {
    let conn
    try {
        // Validation des data (body)
        const check = checkBodyParams(params, tableDef)
        if (!check.success) return check

        //Construction et éxecution de la requête SQL
        const sql = build.sqlInsert(params, tableDef)
        if (!sql.success) return sql

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        if (err.code) {
            return {success: false, method: 'queries.runQueryUpdateById', msg: `Code : ${err.code}, Message : Violation de la contrainte d'unicité - ${err.message}`}
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

const runQueryUpdateById = async (params, tableDef) => {
    let conn, check
    try {
        // Validation du Path Parameter
        check = checkURIParam(params, tableDef)
        if (!check.success) return check

        // Validation des data (body)
        check = checkBodyParams(params, tableDef)
        if (!check.success) return check

        //Construction et éxecution de la requête SQL
        const sql = build.sqlUpdateById(params, tableDef)

        // Éxecution de la requête
        conn = await db.getConnection()
        const result = await conn.query(sql.reqString, sql.reqParams)

        return {success: true, result: result}
    }
    catch(err) {
        if (err.code) {
            return {success: false, method: 'queries.runQueryUpdateById', msg: `Code : ${err.code}, Message : Violation de la contrainte d'unicité - ${err.message}`}
        }
        throw new Error(`${err.message}`)
    }
    finally {
        if (conn) conn.end()
    }
}

module.exports = {runQuerySelect, runQuerySelectById, runQueryDeleteById, runQueryInsert, runQueryUpdateById}