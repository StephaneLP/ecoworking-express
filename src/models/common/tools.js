const {op, dbRelations} = require('../../config/db.params')

/*********************************************************
CONSTRUCTION REQUÊTE SELECT
*********************************************************/

// SELECT : colonnes
const buildColumnsList = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const arrColumns = []
    let mainTableName, joinTableName

    // Table principale
    mainTableName = mainTable.model.tableName
    for (let column of mainTable.columns) {
        arrColumns.push(`${mainTableName}.${column}`)
    }

    // Tables jointes (facultatives)
    for (let table of joinTables) {
        joinTableName = table.model.tableName
        for (let column of table.columns) {
            arrColumns.push(`${joinTableName}.${column}`)
        }        
    }

    return arrColumns
}

// clause FROM
const buildFromConditions = (params) => {
    const mainTable = params.tables.mainTable
    const joinTables = params.tables.joinTables
    const mainTableName = mainTable.model.tableName
    let tableList, condition, joinTableName

    tableList = mainTableName
    for (let joinTable of joinTables) {
        joinTableName = joinTable.model.tableName
        condition = dbRelations[mainTableName][joinTableName][1]
        tableList += ` INNER JOIN ${joinTableName} ON ${condition}`
    }

    return tableList
}

// Clause WHERE
const buildWhereConditions = (params)  => {
    const arrParams = [], arrPattern = [], arrConditions = []
    let value, pattern

    for (let param of params.queryParams) {
        switch (param.op) {
            case op.like:
                value = param.values[0]
                value = value.replace('%', '\\%')       
                value = value.replace('_', '\\_')
                value = param.pattern.replace('?', value)
                arrParams.push(value)
                pattern = '?'
                break
            case op.in:
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
    
        arrConditions.push(`${param.model.tableName}.${param.column} ${param.op} ${pattern}`)
    }

    return {conditions: arrConditions, params: arrParams}
}

// Clause ORDER
const buildSortConditions = (params) => {
    const arrOrder = []
    for (let sort of params.orderParams) {
        arrOrder.push(`${sort.model.tableName}.${sort.column} ${sort.direction}`)
    }

    return arrOrder
}

module.exports = {buildColumnsList, buildFromConditions, buildWhereConditions, buildSortConditions}