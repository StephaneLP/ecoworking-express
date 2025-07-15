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
    const sqlOrderClause = (params.order ? ` ORDER BY ${params.order.column} ${params.order.direction}` : '')

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

const sqlInsert = (params, tableDef) => {
    const arrColumns = [], arrParams = [], arrPattern = []
    let constraints, value

    for(let column in tableDef.tableColumns) {
        constraints = tableDef.tableColumns[column]
        value = params.bodyParams[column] === undefined ? null : params.bodyParams[column]

        if (constraints.autoIncrement) continue
        if (!constraints.nullAuthorized && value === null) {
            return {success: false, method: 'build.sqlInsert', msg: `Colonne '${column}' : Null non autorisé`}
        }

        arrColumns.push(column)
        arrParams.push(value)
        arrPattern.push('?')
    }

    // Date de création
    const dateColumn = tableDef.dateColumns.createDate
    if (dateColumn) {
        arrColumns.push(dateColumn)
        arrParams.push(new Date())
        arrPattern.push('?')
    }

    return {success: true, reqString: `INSERT INTO ${tableDef.tableName} (${arrColumns.join()}) VALUES (${arrPattern.join()})`, reqParams: arrParams}
}

/*********************************************************
UPDATE
*********************************************************/

const sqlUpdateById = (params, tableDef) => {
    const arrColumns = [], arrParams = []
     const URIParam = params.URIParam

       let constraints, value

    // Colonnes mises à jour
    for(let column in params.bodyParams) {
        arrColumns.push(`${column}=?`)
        arrParams.push(params.bodyParams[column])
    }

    // Date de modification
    const dateColumn = tableDef.dateColumns.updateDate
    if (dateColumn) {
        arrColumns.push(`${dateColumn}=?`)
        arrParams.push(new Date())
    }

    // Clause WHERE
    const condition = `${URIParam.column} ${URIParam.op} ?`
    arrParams.push(URIParam.value)
    
    return {success: true, reqString: `UPDATE ${tableDef.tableName} SET ${arrColumns.join()} WHERE ${condition}`, reqParams: arrParams}

}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert, sqlUpdateById}