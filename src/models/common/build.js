/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqParams = [], arrConditions = [], arrPattern = []
    let reqValue, pattern = ''

    for (let param of params.queryStringParams) {
        reqValue = param.value

        switch (param.op.toUpperCase()) {
            case 'LIKE':
                reqValue = reqValue.replace('%', '\\%')       
                reqValue = reqValue.replace('_', '\\_')
                reqValue = param.pattern.replace('?', reqValue)
                reqParams.push(reqValue)               
                pattern = '?'
                break
            case 'IN':            
                reqValue.split(',').forEach(e => {
                    arrPattern.push('?')
                    reqParams.push(e)
                })
                pattern = `(${arrPattern.join()})`
                break
            default:
                reqParams.push(reqValue)
                pattern = '?'

        }
        arrConditions.push(`${param.column} ${param.op} ${pattern}`)
    }

    const strConditions = arrConditions.join(' AND ')
    const sqlWhereClause = strConditions ? ` WHERE ${strConditions}` : ''
    const sqlOrderClause = ` ORDER BY ${params.order.column} ${params.order.direction}`
    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}${sqlOrderClause}`, reqParams: reqParams}
}

const sqlSelectById = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqParams = [params.pathParam.value]
    const sqlWhereClause = ` WHERE ${params.pathParam.column} ${params.pathParam.op} ?`

    return {reqString: `SELECT ${reqColumns} FROM ${reqTables}${sqlWhereClause}`, reqParams: reqParams}
}

/*********************************************************
DELETE
*********************************************************/

const sqlDeleteById = (params, tableName) =>  {
    const reqParams = [params.pathParam.value]
    const sqlWhereClause = ` WHERE ${params.pathParam.column} ${params.pathParam.op} ?`

    return {reqString: `DELETE FROM ${tableName}${sqlWhereClause}`, reqParams: reqParams}
}

module.exports = {sqlSelect, sqlSelectById, sqlDeleteById}