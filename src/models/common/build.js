/*********************************************************
SELECT
*********************************************************/

const sqlSelect = (params, tableName) =>  {
    const reqColumns = params.columns || '*'
    const reqTables = params.tables || tableName
    const reqParams = []
    let reqValue, reqString = '', opAND = ''

    for (let param of params.queryStringParams) {
        reqValue = param.value
        if (param.op.toUpperCase() === 'LIKE') {
            reqValue = reqValue.replace('%', '\\%')       
            reqValue = reqValue.replace('_', '\\_')
            reqValue = param.pattern.replace('?', reqValue)
        }
        reqParams.push(reqValue)

        reqString += `${opAND}${param.column} ${param.op} ?`
        opAND = ' AND '
    }

    const sqlWhereClause = reqString ? ` WHERE ${reqString}` : ''
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