/*********************************************************
CONSTRUCTION REQUÊTE SELECT
*********************************************************/

// SELECT : colonnes
const buildColumnsList = (params) => {
    let colName
    const arrColumns = []

    for (let objColumns of params.columns) {
        for (let column of objColumns.columns) {
            colName = `${objColumns.tableDef.tableName}.${column}`
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
const buildWhereConditions = (params)  => {
    const arrParams = [], arrPattern = [], arrConditions = []
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
    
        arrConditions.push(`${param.tableDef.tableName}.${param.column} ${param.op} ${pattern}`)
    }

    return {conditions: arrConditions, params: arrParams}
}

// Clause ORDER
const buildSortConditions = (params) => {
    const arrOrder = []
    for (let sort of params.order) {
        arrOrder.push(`${sort.tableDef.tableName}.${sort.column} ${sort.direction}`)
    }

    return arrOrder
}

module.exports = {buildColumnsList, buildFromConditions, buildWhereConditions, buildSortConditions}