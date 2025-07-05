/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const arrParams = [], arrConditions = [], arrPattern = []
    let value, pattern

    for (let param of params.queryParams) {
        value = param.value

        switch (param.op.toUpperCase()) {
            case 'LIKE':
                value = value.replace('%', '\\%')       
                value = value.replace('_', '\\_')
                value = param.pattern.replace('?', value)
                arrParams.push(value)               
                pattern = '?'
                break
            case 'IN':            
                value.split(',').forEach(e => {
                    arrPattern.push('?')
                    arrParams.push(e)
                })
                pattern = `(${arrPattern.join()})`
                break
            default:
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

const sqlSelectById = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const arrParams = [params.URIParam.value]
    const sqlWhereClause = ` WHERE ${params.URIParam.column} ${params.URIParam.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (URIParam, tableName) =>  {
    const arrParams = [URIParam.value]
    const sqlWhereClause = ` WHERE ${URIParam.column} ${URIParam.op} ?`

    return {reqString: `DELETE FROM ${tableName}${sqlWhereClause}`, reqParams: arrParams}
}

/*********************************************************
INSERT INTO
*********************************************************/

const sqlInsert = (bodyParams, dbTableDef) => {
    const reqColumns = [], arrParams = [], arrPattern = []
    let constraints, value, pattern

    for(let column in dbTableDef.tableColumns) {
        constraints = dbTableDef.tableColumns[column]
        value = bodyParams[column]

        console.log(column, value, constraints)


    }

    return {reqString: `INSERT INTO ${dbTableDef.tableName} (${sqlWhereClause}) VALUES `, reqParams: arrParams}
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById, sqlInsert}