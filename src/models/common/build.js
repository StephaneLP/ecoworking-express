/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params, tableDef) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableDef.tableName
    const arrParams = [], arrConditions = [], arrPattern = []
    let value, pattern

    for (let param of params.queryParams) {
        switch (param.op.toUpperCase()) {
            case 'LIKE':
                value = param.values[0]
                value = value.replace('%', '\\%')       
                value = value.replace('_', '\\_')
                value = param.pattern.replace('?', value)
                arrParams.push(value)
                pattern = '?'
                break
            case 'IN':
                param.values.forEach(e => {
                    arrPattern.push('?')
                    arrParams.push(e)
                })
                pattern = `(${arrPattern.join()})`
                break
            default:
                value = param.values[0]
                arrParams.push(value)
                pattern = '?'

        }
        arrConditions.push(`${param.column} ${param.op} ${pattern}`)
    }

    const strConditions = arrConditions.join(' AND ')
    const sqlWhereClause = strConditions ? ` WHERE ${strConditions}` : ''
    const sqlOrderClause = ` ORDER BY ${params.order.column} ${params.order.direction}`

    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}${sqlOrderClause}`, reqParams: arrParams}
}

const sqlSelectById = (params, tableDef) =>  {
    const URIParam = params.URIParam
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableDef.tableName
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (params, tableDef) =>  {
    const URIParam = params.URIParam
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `DELETE FROM ${tableDef.tableName}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
INSERT INTO
*********************************************************/

const sqlInsert = (params, dbTableDef) => {
    const arrColumns = [], arrParams = [], arrPattern = []
    let constraints, value

    for(let column in dbTableDef.tableColumns) {
        constraints = dbTableDef.tableColumns[column]
        value = params.bodyParams[column] || null

        if (constraints.autoIncrement) continue
        if (!constraints.nullAuthorized && !value) {
            return {success: false, method: 'build.sqlInsert', msg: `Colonne '${column}' : Null non autorisé`}
        }

        arrColumns.push(column)
        arrParams.push(value)
        arrPattern.push('?')
    }

    return {success: true, reqString: `INSERT INTO ${dbTableDef.tableName} (${arrColumns.join()}) VALUES (${arrPattern.join()})`, reqParams: arrParams}
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert}