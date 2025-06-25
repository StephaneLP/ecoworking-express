const db = require('../../config/db.js')
const {checkPathParameter} = require('./validation.js')

/*********************************************************
Requête SELECT (method GET / READ)
*********************************************************/

const reqSELECT = async (params, dbTableDef) => {
    let sqlWhereClause = ''
    const reqParams = []

    // Validation du Path Parameter et construction de la clause WHERE de la requête SQL
    const pathParameter = params.pathParameter

    if (pathParameter) {
        try{
            checkPathParameter(pathParameter, dbTableDef.tableColumns)
            sqlWhereClause = ` WHERE ${pathParameter.name} ${pathParameter.op} ?`
            reqParams.push(pathParameter.value)
        }
        catch(err) {
            return {success: false, code: 400, error: `Vérification du 'Path Parameter' (checkPathParameter) : ${err.message}`}
        }
    }
    
    // Validation ses paramètres de la chaine queryString et construction de la clause WHERE de la requête SQL
    const queryString = params.queryString

    if (queryString) {
        console.log('queryString', queryString)
    }

    // Construction de la requête SQL
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || dbTableDef.tableName
    const reqOrder = params.order ? ` ORDER BY ${params.order}` : ''
    const reqSql = `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}${reqOrder}`

    // Éxecution de la requête SQL envoi du résultat au contrôleur
    let conn
    try {
        conn = await db.getConnection()
        const rows = await conn.query(reqSql, reqParams)
        return {success: true, rows: rows}
    } 
    catch (err) {
        return {success: false, code: 500, error: err}
    } 
    finally {
        if (conn) conn.end()
    }
}

module.exports = {reqSELECT}