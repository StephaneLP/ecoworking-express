/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params) =>  {
    // SELECT : colonnes 
    const oneTable = (params.tables.length === 1)
    const arrColumns = []
    let tableName, reqColumns = '*'

    if (params.columns) {
        for (let objColumns of params.columns) {
            tableName = (oneTable ? '' : objColumns.tableDef.tableName + '.')
            for (let column of objColumns.columns) {
                arrColumns.push(tableName + column)
            }
        }
        reqColumns = arrColumns.join(', ')
    }

    // FROM : tables et jointures
    let reqFROM = params.tables[0]

    for (let key in params.tables) {
        if (key > 0) {
            reqFROM += ` INNER JOIN ${params.tables[key][0]}`
            reqFROM += ` ON ${params.tables[key][1]}`
        }
    }

    // WHERE : conditions
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
        tableName = (oneTable ? '' : param.tableDef.tableName + '.')
        arrConditions.push(`${tableName + param.column} ${param.op} ${pattern}`)
    }
    const reqConditions = arrConditions.join(' AND ')
    const reqWhere = reqConditions ? ` WHERE ${reqConditions}` : ''

    // ORDER : tri
    const arrOrder = []
    for (let sort of params.order) {
        tableName = (oneTable ? '' : sort.tableDef.tableName + '.')
        arrOrder.push(`${tableName + sort.column} ${sort.direction}`)
    }
    const reqOrder = ` ORDER BY ${arrOrder.join(', ')}`

    return {reqString: `SELECT ${reqColumns} FROM ${reqFROM}${reqWhere}${reqOrder}`, reqParams: arrParams}
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
INSERT INTO
*********************************************************/

const sqlInsert = (params) => {
    const tableDef = params.tableDef
    const arrColumns = [], arrParams = [], arrPattern = []
    let constraints, value

    for(let column in tableDef.tableColumns) {
        constraints = tableDef.tableColumns[column]
        value = params.bodyParams[column] === undefined ? null : params.bodyParams[column]

        if (constraints.autoIncrement) continue
        if (!constraints.nullAuthorized && value === null) {
            return {success: false, functionName: 'build.sqlInsert', msg: `Colonne '${column}' : Null non autorisé`}
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

const sqlUpdateById = (params) => {
    const arrColumns = [], arrParams = []
    const URIParam = params.URIParam
    const tableDef = params.tableDef

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

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (params) =>  {
    const URIParam = params.URIParam
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `DELETE FROM ${params.tableDef.tableName}${sqlWhereClause}`, reqParams: arrParams}
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert, sqlUpdateById}