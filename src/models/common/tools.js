/*********************************************************
CONSTRUCTION REQUÊTE SELECT
*********************************************************/

// SELECT : colonnes
const buildColumnsList = (params, oneTable) => {
    const dateFormat = params.dateFormat || ''
    let colName, tableName, isDate, inDateColumns, inTableColumns
    const arrColumns = []

    for (let objColumns of params.columns) {
        tableName = (oneTable ? '' : objColumns.tableDef.tableName + '.')
        for (let column of objColumns.columns) {
            inDateColumns = Object.values(objColumns.tableDef.dateColumns).includes(column)
            inTableColumns = Boolean(objColumns.tableDef.tableColumns[column])
            isDate = Boolean(inDateColumns || (objColumns.tableDef.tableColumns[column].type === 'date'))
            colName = tableName + column
            colName = (isDate ? `DATE_FORMAT(${colName}, '${dateFormat}') AS ${colName}` : colName)
            arrColumns.push(colName)
        }
    }

    return arrColumns
}

// clause FROM
const buildFromConditions = (params) => {
    let tableList = params.tables[0]
    for (let key in params.tables) {
        if (key > 0) tableList += ` INNER JOIN ${params.tables[key][0]} ON ${params.tables[key][1]}`
    }

    return tableList
}

// Clause WHERE
const buildWhereConditions = (params, oneTable)  => {
    const arrParams = [], arrPattern = [], arrConditions = []
    let value, pattern,tableName

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

    return {conditions: arrConditions, params: arrParams}
}

// Clause ORDER
const buildSortConditions = (params, oneTable) => {
    let tableName
    const arrOrder = []
    for (let sort of params.order) {
        tableName = (oneTable ? '' : sort.tableDef.tableName + '.')
        arrOrder.push(`${tableName + sort.column} ${sort.direction}`)
    }

    return arrOrder
}


module.exports = {buildColumnsList, buildFromConditions, buildWhereConditions, buildSortConditions}